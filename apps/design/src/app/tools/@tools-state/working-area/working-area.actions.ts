import { Action } from '@ngrx/store';
import { OvenApp, SyncReasonMsg } from '@common';

import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';

export namespace WorkingAreaActions {
  export enum ActionTypes {
    ChangeMode = '[WorkingArea] Change Mode',
    SyncState = '[WorkingArea] Sync State',
    ForcePageNavigation = '[WorkingArea] Force Page Navigation',
    // Has to be fired when iframe loaded
    FinishLoading = '[WorkingArea] Finish Loading',
    SetOvenState = '[WorkingArea] Set Oven State',
    SyncAll = '[WorkingArea] Sync all',
  }

  export class SyncState implements Action {
    readonly type = ActionTypes.SyncState;

    constructor(public syncReason?: SyncReasonMsg) {
    }
  }

  export class FinishLoading implements Action {
    readonly type = ActionTypes.FinishLoading;
  }

  export class ForcePageNavigation implements Action {
    readonly type = ActionTypes.ForcePageNavigation;
  }

  export class ChangeMode implements Action {
    readonly type = ActionTypes.ChangeMode;

    constructor(public mode: WorkingAreaMode) {
    }
  }

  export class SetOvenState implements Action {
    readonly type = ActionTypes.SetOvenState;

    constructor(public app: OvenApp, public syncReason?: SyncReasonMsg) {
    }
  }

  export class SyncAll implements Action {
    readonly type = ActionTypes.SyncAll;
  }

  export type ActionsUnion = SyncState | FinishLoading | ChangeMode | ForcePageNavigation | SetOvenState;
}
