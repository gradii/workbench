import { Action } from '@ngrx/store';

import { BakeryApp } from '@tools-state/app/app.model';

export namespace AppActions {
  export enum ActionTypes {
    ClearAppState = '[App] Clear App State',
    InitApplication = '[App] Init Application',
  }

  export class InitApplication implements Action {
    readonly type = ActionTypes.InitApplication;

    constructor(public state: BakeryApp) {
    }
  }

  export class ClearAppState implements Action {
    readonly type = ActionTypes.ClearAppState;
  }

  export type ActionsUnion = ClearAppState | InitApplication;
}
