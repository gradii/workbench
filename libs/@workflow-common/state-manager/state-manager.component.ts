import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { StoreItem } from '@common/public-api';
import { TriDialogRef } from '@gradii/triangle/dialog';

import { StoreItemFacade } from '@tools-state/data/store-item/store-item-facade.service';
import { Subject } from 'rxjs';
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { WorkflowDialogService } from '../dialog/workflow-dialog.service';
import { StoreItemUtilService } from '../util/store-item-util.service';

@Component({
  selector       : 'pf-variable-manage',
  styleUrls      : ['./state-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-card>
      <tri-card-header>
        <tri-icon svgIcon="reiki:brace-variable"></tri-icon>
        Variable
        <tri-card-header-extra>
          <tri-icon tri-dialog-close svgIcon="outline:close"></tri-icon>
        </tri-card-header-extra>
      </tri-card-header>

      <tri-card-body>
        <pf-state-variable-list
          [createMode]="createMode"
          (create)="confirmAndCreateStoreItem()"
          (delete)="confirmDeleteStoreItem($event)"
          (duplicate)="confirmDuplicateStoreItem($event)"
          (selectStoreItem)="confirmSelectStoreItem($event)"
        ></pf-state-variable-list>

        <tri-tab-group style="flex:1" animationDuration="0">
          <tri-tab title="Variable Properties">
            <pf-variable-manage-form
              [createMode]="createMode"
              [unSaved]="hasUnsavedChanges"
              (save)="saveStoreItem($event)"
              (delete)="confirmDeleteStoreItem($event)"
              (duplicate)="confirmDuplicateStoreItem($event)"
              (unsavedChange)="hasUnsavedChanges = $event"
            >
            </pf-variable-manage-form>
          </tri-tab>
          <tri-tab title="Variable References">
            <pf-variable-manage-reference>
            </pf-variable-manage-reference>
          </tri-tab>
        </tri-tab-group>
      </tri-card-body>
      <tri-card-footer>
        <span style="align-self: center;justify-self: flex-start;margin-right: auto;">current binding variable: xxxx</span>
        <button triButton variant="fill" color="danger">Unbind</button>
        <button triButton variant="text" (click)="closeModal()">Discard</button>
        <button triButton variant="fill" color="primary">Bind</button>
      </tri-card-footer>
    </tri-card>
  `
})
export class StateManagerComponent implements OnDestroy, OnInit {
  // from modal `userConfig`
  @Input() createMode: boolean;
  @Input() closeOnCreate: boolean;

  hasUnsavedChanges                 = false;
  private destroyed$: Subject<void> = new Subject();

  constructor(
    private storeItemFacade: StoreItemFacade,
    private storeItemUtils: StoreItemUtilService,
    private workflowDialogService: WorkflowDialogService,
    private dialogRef: TriDialogRef<StateManagerComponent>
  ) {
  }

  ngOnInit() {
    this.subscribeToStoreItemListChange();
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  confirmAndCreateStoreItem() {
    if (!this.hasUnsavedChanges) {
      this.createStoreItem();
      return;
    }
    this.workflowDialogService
      .openConfirmUnsavedChangesModal()
      .afterClosed().pipe(filter(Boolean), takeUntil(this.destroyed$))
      .subscribe(() => this.createStoreItem());
  }

  confirmDuplicateStoreItem(storeItem: StoreItem) {
    if (!this.hasUnsavedChanges) {
      this.duplicateStoreItem(storeItem);
      return;
    }
    this.workflowDialogService
      .openConfirmUnsavedChangesModal()
      .afterClosed().pipe(filter(Boolean), takeUntil(this.destroyed$))
      .subscribe(() => this.duplicateStoreItem(storeItem));
  }

  confirmSelectStoreItem(storeItemId: string) {
    if (!this.hasUnsavedChanges && !this.createMode) {
      this.selectStoreItem(storeItemId);
      return;
    }
    this.workflowDialogService
      .openConfirmUnsavedChangesModal()
      .afterClosed().pipe(filter(Boolean), takeUntil(this.destroyed$))
      .subscribe(() => this.selectStoreItem(storeItemId));
  }

  saveStoreItem(storeItem: StoreItem) {
    this.storeItemUtils
      .saveStoreItem(storeItem)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.handleSaveStoreItem(storeItem));
  }

  confirmDeleteStoreItem(storeItem: StoreItem) {
    this.workflowDialogService
      .openDeleteStoreItemModal()
      .afterClosed().pipe(
      filter(Boolean),
      withLatestFrom(this.storeItemUtils.storeItemList$),
      map(([, list]: [boolean, StoreItem[]]) => this.findNextSelectedStoreItem(list, storeItem.id)),
      takeUntil(this.destroyed$)
    )
      .subscribe((newSelectedId: string) => {
        this.selectStoreItem(newSelectedId);
        this.storeItemFacade.deleteStoreItem(storeItem.id);
      });
  }

  closeModal(storeItemId?: string) {
    this.dialogRef.close(storeItemId);
  }

  private handleSaveStoreItem(storeItem: StoreItem) {
    if (this.closeOnCreate) {
      this.closeModal(storeItem.id);
    } else {
      this.selectStoreItem(storeItem.id);
    }
  }

  private selectStoreItemAfterLoad(storeItemList: StoreItem[]) {
    if (!this.createMode && storeItemList.length) {
      this.storeItemUtils.selectStoreItem(storeItemList[0].id);
    } else {
      this.storeItemUtils.selectStoreItem(null);
    }
  }

  private createStoreItem() {
    this.createMode = true;
    this.storeItemUtils.selectStoreItem(null);
    this.hasUnsavedChanges = true;
  }

  private selectStoreItem(storeItemId: string) {
    this.createMode = false;
    this.storeItemUtils.selectStoreItem(storeItemId);
    this.hasUnsavedChanges = false;
  }

  private duplicateStoreItem(storeItem: StoreItem) {
    this.storeItemUtils
      .duplicateStoreItem(storeItem)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((newId: string) => {
        this.storeItemUtils.selectStoreItem(newId);
      });
  }

  private subscribeToStoreItemListChange() {
    this.storeItemUtils.storeItemList$.pipe(takeUntil(this.destroyed$)).subscribe((storeItemList: StoreItem[]) => {
      this.selectStoreItemAfterLoad(storeItemList);
    });
  }

  private findNextSelectedStoreItem(storeItemList: StoreItem[], deletedStoreItemId) {
    let newId = null;
    for (const storeItem of storeItemList) {
      const deletedStoreItem = deletedStoreItemId === storeItem.id;
      if (deletedStoreItem && newId) {
        break;
      }
      if (!deletedStoreItem) {
        newId = storeItem.id;
        break;
      }
    }
    return newId;
  }
}
