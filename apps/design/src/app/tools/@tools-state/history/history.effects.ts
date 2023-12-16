import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap } from 'rxjs/operators';
import { onlyLatestFrom } from '@common';
import { select, Store } from '@ngrx/store';

import { HistoryActions } from '@tools-state/history/history.actions';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { WorkingAreaFacade } from '@tools-state/working-area/working-area-facade.service';
import { fromHistory } from '@tools-state/history/history.reducer';
import { getTimeIndex } from '@tools-state/history/history.selectors';
import { getWorkingAreaMode } from '@tools-state/meta/history';

@Injectable()
export class HistoryEffects {
  private forward$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(HistoryActions.ActionTypes.Forward),
        onlyLatestFrom(this.store.pipe(select(getTimeIndex))),
        map((timeIndex: number) => [getWorkingAreaMode(timeIndex - 1), getWorkingAreaMode(timeIndex)]),
        filter(([currentWorkingAreaMode, nextWorkingAreaMode]: [WorkingAreaMode, WorkingAreaMode]) => {
          return currentWorkingAreaMode !== nextWorkingAreaMode;
        }),
        map(([currentWorkingAreaMode, nextWorkingAreaMode]: [WorkingAreaMode, WorkingAreaMode]) => nextWorkingAreaMode),
        switchMap((workingAreaMode: WorkingAreaMode) =>
          this.workingAreaFacade.navigateByWorkingAreaMode(workingAreaMode)
        )
      ),
    { dispatch: false }
  );

  private backward$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(HistoryActions.ActionTypes.Back),
        onlyLatestFrom(this.store.pipe(select(getTimeIndex))),
        map((timeIndex: number) => [getWorkingAreaMode(timeIndex), getWorkingAreaMode(timeIndex + 1)]),
        filter(([prevWorkingAreaMode, currentWorkingAreaMode]: [WorkingAreaMode, WorkingAreaMode]) => {
          return prevWorkingAreaMode !== currentWorkingAreaMode;
        }),
        map(([prevWorkingAreaMode, currentWorkingAreaMode]: [WorkingAreaMode, WorkingAreaMode]) => prevWorkingAreaMode),
        switchMap((workingAreaMode: WorkingAreaMode) =>
          this.workingAreaFacade.navigateByWorkingAreaMode(workingAreaMode)
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromHistory.State>,
    private workingAreaFacade: WorkingAreaFacade
  ) {
  }
}
