import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';
import { StoreItem } from '@common/public-api';

import { StoreItemFacade } from '@tools-state/data/store-item/store-item-facade.service';

@Component({
  selector       : 'ub-state-item-name',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-form-field labelOrientation="vertical">
      <tri-icon svgIcon="workbench:workflow-save-step"></tri-icon>
      <tri-select
        fullWidth
        size="tiny"
        placeholder="Enter name"
        [ngModel]="itemName$ | async"
        (valueChange)="selectOption($event)"
        (input)="isValueSelected = false"
      >
        <ub-add-new-value-button (click)="addStoreItem.emit()"></ub-add-new-value-button>
        <tri-option *ngFor="let it of searchOptions$ | async" [value]="it.id">{{it.displayValue}}</tri-option>
      </tri-select>
    </tri-form-field>

    <span *ngIf="!isValueSelected" class="validation-error">
      Variable isn't selected.
    </span>
  `,
  styleUrls      : ['./state-item-name.component.scss']
})
export class StateItemNameComponent {
  isValueSelected: boolean;

  @Input() set itemId(itemId: string) {
    this.updatedStoreItemId.next(itemId);
    this.isValueSelected = true;
  }

  @Output() addStoreItem    = new EventEmitter();
  @Output() selectStoreItem = new EventEmitter<string>();

  updatedStoreItemId    = new BehaviorSubject<string>(null);
  selectedStoreItemName = new Subject<string>();

  updatedStoreItemName$ = combineLatest([
    this.storeItemFacade.storeItemList$,
    this.updatedStoreItemId.asObservable()
  ]).pipe(
    map(([storeItemsList, storeItemId]: [StoreItem[], string]) => {
      const item = storeItemsList.find(i => i.id === storeItemId);
      return item && item.name;
    })
  );

  itemName$ = merge(this.updatedStoreItemName$, this.selectedStoreItemName.asObservable());

  searchOptions$ = this.storeItemFacade.storeItemList$.pipe(
    map((itemList: StoreItem[]) => {
      return itemList.map((item: StoreItem) => ({
        displayValue: item.name,
        id          : item.id,
        filterValues: [item.name],
        icon        : 'workflow-save-step',
        iconPack    : 'bakery'
      }));
    })
  );

  constructor(private storeItemFacade: StoreItemFacade) {
  }

  selectOption(item: any) {
    this.selectedStoreItemName.next(item.displayValue);
    this.selectStoreItem.emit(item.id);
  }
}
