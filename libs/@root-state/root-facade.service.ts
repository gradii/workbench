import { Injectable } from '@angular/core';
import { dispatch } from '@ngneat/effects';
import { RootActions } from '@root-state/root.actions';

@Injectable({ providedIn: 'root' })
export class RootFacade {
  constructor() {
  }

  clearStore() {
    dispatch(RootActions.ClearStore());
  }
}
