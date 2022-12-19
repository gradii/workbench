import { KitchenApp, SyncReasonMsg } from '@common/public-api';
import { createAction } from '@ngneat/effects';

import { WorkingAreaMode, WorkingAreaWorkflowMode } from '@tools-state/working-area/working-area.model';

export namespace WorkingAreaActions {
  export enum ActionTypes {
    ChangeMode          = '[WorkingArea] Change Mode',
    ChangeWorkflowMode  = '[WorkingArea] Change Workflow Mode',
    SyncState           = '[WorkingArea] Sync State',
    ForcePageNavigation = '[WorkingArea] Force Page Navigation',
    // Has to be fired when iframe loaded
    FinishLoading       = '[WorkingArea] Finish Loading',
    SetKitchenState     = '[WorkingArea] Set Kitchen State',
    SyncAll             = '[WorkingArea] Sync all',
  }

  export const SyncState           = createAction(
    ActionTypes.SyncState, (syncReason?: SyncReasonMsg) => ({ syncReason })
  );
  export const FinishLoading       = createAction(ActionTypes.FinishLoading);
  export const ForcePageNavigation = createAction(ActionTypes.ForcePageNavigation);
  export const ChangeMode          = createAction(ActionTypes.ChangeMode, (mode: WorkingAreaMode) => ({ mode }));
  export const ChangeWorkflowMode  = createAction(
    ActionTypes.ChangeWorkflowMode, (workflowMode: WorkingAreaWorkflowMode) => ({ workflowMode })
  );
  export const SetKitchenState     = createAction(
    ActionTypes.SetKitchenState, (app: KitchenApp, syncReason?: SyncReasonMsg) => ({ app, syncReason })
  );
  export const SyncAll             = createAction(ActionTypes.SyncAll);
}
