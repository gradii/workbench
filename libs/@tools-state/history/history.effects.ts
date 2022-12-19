import { Injectable } from '@angular/core';
import { onlyLatestFrom } from '@common/public-api';
import { createEffect, ofType } from '@ngneat/effects';

import { HistoryActions } from '@tools-state/history/history.actions';
import { getTimeIndex } from '@tools-state/history/history.selectors';
import { getWorkingAreaMode } from '@tools-state/meta/history';
import { WorkingAreaFacade } from '@tools-state/working-area/working-area-facade.service';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { filter, map, switchMap } from 'rxjs/operators';

@Injectable()
export class HistoryEffects {
  private forward$ = createEffect(
    (actions) => actions.pipe(
      ofType(HistoryActions.Forward),
      onlyLatestFrom(getTimeIndex),
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
    (actions) => actions.pipe(
      ofType(HistoryActions.Back),
      onlyLatestFrom(getTimeIndex),
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
    private workingAreaFacade: WorkingAreaFacade
  ) {
  }
}
