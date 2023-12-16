import { Injectable } from '@angular/core';
import { StoreItem, onlyLatestFrom } from '@common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { filter, map, pairwise, switchMap } from 'rxjs/operators';

import { StoreItemActions } from '@tools-state/data/store-item/store-item.actions';
import { getStoreItemList } from '@tools-state/data/store-item/store-item.selectors';
import { fromTools } from '@tools-state/tools.reducer';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';

@Injectable()
export class DataEffects {
  constructor(private actions$: Actions, private store: Store<fromTools.State>) {
  }

  resetState = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkingAreaActions.ActionTypes.ChangeMode),
      map((action: WorkingAreaActions.ChangeMode) => action.mode),
      pairwise(),
      filter(([prevMode, nextMode]: [WorkingAreaMode, WorkingAreaMode]) => {
        return this.isPreviewMode(nextMode) && !this.isPreviewMode(prevMode);
      }),
      onlyLatestFrom(this.store.pipe(select(getStoreItemList))),
      switchMap((storeItemList: StoreItem[]) => {
        if (!storeItemList.length) {
          return [];
        }

        const updates: Update<StoreItem>[] = [];
        for (const item of storeItemList) {
          updates.push({ id: item.id, changes: { value: item.initialValue } });
        }

        return [StoreItemActions.updateStoreItemList({ list: updates }), new WorkingAreaActions.SyncState()];
      })
    )
  );

  private isPreviewMode(mode: WorkingAreaMode): boolean {
    return mode === WorkingAreaMode.PREVIEW || mode === WorkingAreaMode.PAINTER;
  }
}
