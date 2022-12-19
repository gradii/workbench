import { Injectable } from '@angular/core';
import { onlyLatestFrom, StoreItem } from '@common/public-api';
import { createEffect, ofType } from '@ngneat/effects';

import { StoreItemActions } from '@tools-state/data/store-item/store-item.actions';
import { getStoreItemList } from '@tools-state/data/store-item/store-item.selectors';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { filter, map, pairwise, switchMap } from 'rxjs/operators';

@Injectable()
export class DataEffects {
  constructor() {
  }

  resetState = createEffect((actions) =>
    actions.pipe(
      ofType(WorkingAreaActions.ChangeMode),
      map((action) => action.mode),
      pairwise(),
      filter(([prevMode, nextMode]: [WorkingAreaMode, WorkingAreaMode]) => {
        return this.isPreviewMode(nextMode) && !this.isPreviewMode(prevMode);
      }),
      onlyLatestFrom(getStoreItemList),
      switchMap((storeItemList: StoreItem[]) => {
        if (!storeItemList.length) {
          return [];
        }

        const updates: Partial<StoreItem>[] = [];
        for (const item of storeItemList) {
          updates.push({ id: item.id, value: item.initialValue });
        }

        return [StoreItemActions.UpdateStoreItemList(updates), WorkingAreaActions.SyncState()];
      })
    ), { dispatch: true }
  );

  private isPreviewMode(mode: WorkingAreaMode): boolean {
    return mode === WorkingAreaMode.PREVIEW || mode === WorkingAreaMode.PAINTER;
  }
}
