import { createAction } from '@ngneat/effects';

import { PuffApp } from '@tools-state/app/app.model';

export namespace AppActions {
  export enum ActionTypes {
    ClearAppState   = '[App] Clear App State',
    InitApplication = '[App] Init Application',
  }

  export const InitApplication = createAction(
    ActionTypes.InitApplication,
    (state: PuffApp) => ({ state })
  );

  export const ClearAppState = createAction(
    ActionTypes.ClearAppState
  );
}
