import { Injectable } from '@angular/core';
import { StoreItem } from '@common/public-api';
import { dispatch } from '@ngneat/effects';
import { Action } from '@ngneat/effects/lib/actions.types';
import { CommunicationService } from '@shared/communication/communication.service';
import { StoreItemActions } from '@tools-state/data/store-item/store-item.actions';

import { getStoreItemById, getStoreItemList } from '@tools-state/data/store-item/store-item.selectors';
import { VariableRenameService } from '@tools-state/data/variable-rename.service';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StoreItemFacade {
  readonly storeItemList$: Observable<StoreItem[]> = getStoreItemList;

  constructor(
    private variableRenameService: VariableRenameService,
    private communication: CommunicationService
  ) {
    this.communication.updateStoreItem$.subscribe(
      (update: Partial<StoreItem>) => this.updateStoreItemValue(update)
    );
  }

  createStoreItem(storeItem: StoreItem) {
    dispatch(StoreItemActions.CreateStoreItem(storeItem));
    dispatch(WorkingAreaActions.SyncState());
    dispatch(ProjectActions.UpdateProject());
    dispatch(HistoryActions.Persist());
  }

  updateStoreItem(update: Partial<StoreItem>) {
    getStoreItemById(update.id)
      .pipe(
        take(1),
        switchMap((oldItem: StoreItem) =>
          this.variableRenameService.rename(oldItem.name, update.name, 'state')
        )
      )
      .subscribe((renameActions: Action[]) => {
        for (const action of renameActions) {
          dispatch(action);
        }
        dispatch(StoreItemActions.UpdateStoreItem(update));
        dispatch(WorkingAreaActions.SyncState());
        dispatch(ProjectActions.UpdateProject());
        dispatch(HistoryActions.Persist());
      });
  }

  updateStoreItemValue(update: Partial<StoreItem>) {
    dispatch(StoreItemActions.UpdateStoreItem(update));
  }

  deleteStoreItem(id: string) {
    dispatch(StoreItemActions.DeleteStoreItem(id));
    dispatch(WorkingAreaActions.SyncState());
    dispatch(ProjectActions.UpdateProject());
    dispatch(HistoryActions.Persist());
  }
}
