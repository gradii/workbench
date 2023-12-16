import { Action } from '@ngrx/store';

export namespace RootActions {
  export enum ActionTypes {
    ClearStore = '[Root] Clear Store',
  }

  export class ClearStore implements Action {
    readonly type = ActionTypes.ClearStore;
  }
}
