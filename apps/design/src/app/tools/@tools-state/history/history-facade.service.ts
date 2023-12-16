import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { HistoryActions } from '@tools-state/history/history.actions';
import { canBack, canForward } from '@tools-state/history/history.selectors';
import { fromTools } from '@tools-state/tools.reducer';

@Injectable({ providedIn: 'root' })
export class HistoryFacadeService {
  readonly canForward$ = this.store.pipe(select(canForward));
  readonly canBack$ = this.store.pipe(select(canBack));

  constructor(private store: Store<fromTools.State>) {
  }

  forward() {
    this.store.dispatch(new HistoryActions.Forward());
  }

  back() {
    this.store.dispatch(new HistoryActions.Back());
  }

  persistNavigationToCurrentTool(): void {
    this.store.dispatch(new HistoryActions.Persist());
  }
}
