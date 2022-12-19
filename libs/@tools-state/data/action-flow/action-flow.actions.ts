import { ActionFlow } from '@common/public-api';
import { createAction } from '@ngneat/effects';

export namespace ActionFlowActions {

  export enum ActionTypes {
    AddActionFlow           = '[ActionFlow] Add ActionFlow Node',
    AddActionFlowList       = '[ActionFlow] Add ActionFlow List',
    UpsertActionFlow        = '[ActionFlow] Upsert ActionFlow',
    UpdateActionFlowList    = '[ActionFlow] Update ActionFlow List',
    DeleteActionFlow        = '[ActionFlow] Delete ActionFlow',

    SelectActionFlow        = '[ActionFlow] Select ActionFlow',
    SelectActionFlowAndStep = '[ActionFlow] Select ActionFlow Step',
  }

  export const AddActionFlow        = createAction(ActionTypes.AddActionFlow,
    (actionFlowId: string, actionFlow: Omit<ActionFlow, 'id'>) => ({ actionFlowId, actionFlow }));
  export const AddActionFlowList    = createAction(ActionTypes.AddActionFlowList,
    (actionFlowList: ActionFlow[]) => ({ actionFlowList }));
  export const UpsertActionFlow     = createAction(ActionTypes.UpsertActionFlow,
    (actionFlow: ActionFlow) => ({ actionFlow }));
  export const UpdateActionFlowList = createAction(ActionTypes.UpdateActionFlowList,
    (list: Partial<ActionFlow>[]) => ({ list }));
  export const DeleteActionFlow     = createAction(ActionTypes.DeleteActionFlow,
    (id: string) => ({ id }));
  export const SelectActionFlow     = createAction(ActionTypes.SelectActionFlow,
    (id: string) => ({ id }));
  // export const SelectActionFlowAndNode = createAction(ActionTypes.SelectActionFlowAndNode,
  //   (actionFlowId: string, id: string) => ({ actionFlowId, id }));
  // export const SelectNode                 = createAction(ActionTypes.SelectNode,
  //   (activeNodeId: string, activeNodeSelection?: any) => ({ activeNodeId, activeNodeSelection }));

}

