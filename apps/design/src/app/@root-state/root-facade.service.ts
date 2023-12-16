import { Injectable } from '@angular/core';
import { fromRoot } from '@root-state/root.reducer';
import { Store } from '@ngrx/store';
import { RootActions } from '@root-state/root.actions';

@Injectable({ providedIn: 'root' })
export class RootFacade {
  constructor(private store: Store<fromRoot.State>) {
  }

  clearStore() {
    this.store.dispatch(new RootActions.ClearStore());
  }
}
