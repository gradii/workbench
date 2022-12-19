import { ActionDiagram } from '@common/public-api';
import { createAction } from '@ngneat/effects';

export namespace ActionDiagramActions {
  export enum ActionTypes {
    AddActionDiagramList       = '[ActionDiagram] Add Action Diagram List',
    UpsertActionDiagram        = '[ActionDiagram] Upsert ActionDiagram',
    UpdateActionDiagramList    = '[ActionDiagram] Update ActionDiagram List',
    DeleteActionDiagram        = '[ActionDiagram] Delete ActionDiagram',

    SelectActionDiagram        = '[ActionDiagram] Select ActionDiagram',
    SelectActionDiagramAndNode = '[ActionDiagram] Select ActionDiagram Node',
    SelectNode                 = '[ActionDiagram] Select Node',
  }

  export const AddActionDiagramList       = createAction(ActionTypes.AddActionDiagramList,
    (actionDiagramList: ActionDiagram[]) => ({ actionDiagramList }));
  export const UpsertActionDiagram        = createAction(ActionTypes.UpsertActionDiagram,
    (actionDiagram: ActionDiagram) => ({ actionDiagram }));
  export const UpdateActionDiagramList    = createAction(ActionTypes.UpdateActionDiagramList,
    (list: Partial<ActionDiagram>[]) => ({ list }));
  export const DeleteActionDiagram        = createAction(ActionTypes.DeleteActionDiagram,
    (id: string) => ({ id }));
  export const SelectActionDiagram        = createAction(ActionTypes.SelectActionDiagram,
    (id: string) => ({ id }));
  export const SelectActionDiagramAndNode = createAction(ActionTypes.SelectActionDiagramAndNode,
    (actionDiagramId: string, id: string) => ({ actionDiagramId, id }));
  export const SelectNode                 = createAction(ActionTypes.SelectNode,
    (activeNodeId: string, activeNodeSelection?: any) => ({ activeNodeId, activeNodeSelection }));
}
