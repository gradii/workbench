import { Injectable } from '@angular/core';
import { StoreItem } from '@common';
import { Action, select, Store } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { VariableRenameService } from '@tools-state/data/variable-rename.service';
import { Observable } from 'rxjs';

import { getStoreItemById, getStoreItemList } from '@tools-state/data/store-item/store-item.selectors';
import { fromTools } from '@tools-state/tools.reducer';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { HistoryActions } from '@tools-state/history/history.actions';
import { StoreItemActions } from '@tools-state/data/store-item/store-item.actions';
import { CommunicationService } from '@shared/communication/communication.service';
import { switchMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StoreItemFacade {
  readonly storeItemList$: Observable<StoreItem[]> = this.store.pipe(select(getStoreItemList));

  constructor(
    private store: Store<fromTools.State>,
    private variableRenameService: VariableRenameService,
    private communication: CommunicationService
  ) {
    this.communication.updateStoreItem$.subscribe((update: Update<StoreItem>) => this.updateStoreItemValue(update));
  }

  createStoreItem(storeItem: StoreItem) {
    this.store.dispatch(StoreItemActions.createStoreItem({ storeItem }));
    this.store.dispatch(new WorkingAreaActions.SyncState());
    this.store.dispatch(new ProjectActions.UpdateProject());
    this.store.dispatch(new HistoryActions.Persist());
  }

  updateStoreItem(update: Update<StoreItem>) {
    this.store
      .pipe(
        select(getStoreItemById, update.id),
        take(1),
        switchMap((oldItem: StoreItem) =>
          this.variableRenameService.rename(oldItem.name, update.changes.name, 'state')
        )
      )
      .subscribe((renameActions: Action[]) => {
        for (const action of renameActions) {
          this.store.dispatch(action);
        }
        this.store.dispatch(StoreItemActions.updateStoreItem({ update }));
        this.store.dispatch(new WorkingAreaActions.SyncState());
        this.store.dispatch(new ProjectActions.UpdateProject());
        this.store.dispatch(new HistoryActions.Persist());
      });
  }

  updateStoreItemValue(update: Update<StoreItem>) {
    this.store.dispatch(StoreItemActions.updateStoreItem({ update }));
  }

  deleteStoreItem(id: string) {
    this.store.dispatch(StoreItemActions.deleteStoreItem({ id }));
    this.store.dispatch(new WorkingAreaActions.SyncState());
    this.store.dispatch(new ProjectActions.UpdateProject());
    this.store.dispatch(new HistoryActions.Persist());
  }
}
