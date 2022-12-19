import { Injectable } from '@angular/core';
import { dispatch } from '@ngneat/effects';

import { HistoryActions } from '@tools-state/history/history.actions';
import { canBack, canForward } from '@tools-state/history/history.selectors';

@Injectable({ providedIn: 'root' })
export class HistoryFacadeService {
  readonly canForward$ = canForward;
  readonly canBack$    = canBack;

  constructor() {
  }

  forward() {
    dispatch(HistoryActions.Forward());
  }

  back() {
    dispatch(HistoryActions.Back());
  }

  persistNavigationToCurrentTool(): void {
    dispatch(HistoryActions.Persist());
  }
}
