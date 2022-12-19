import { createAction } from '@ngneat/effects';
import { Workflow } from '@common/public-api';

export namespace WorkflowActions {
  export enum ActionTypes {
    AddWorkflowList       = '[Workflow] Add Workflow List',
    UpsertWorkflow        = '[Workflow] Upsert Workflow',
    UpdateWorkflowList    = '[Workflow] Update Workflow List',
    DeleteWorkflow        = '[Workflow] Delete Workflow',

    SelectWorkflow        = '[Workflow] Select Workflow',
    SelectWorkflowAndStep = '[Workflow] Select Workflow Step',
    SelectStep            = '[Workflow] Select Step',
  }

  export const AddWorkflowList    = createAction(ActionTypes.AddWorkflowList,
    (workflowList: Workflow[]) => ({ workflowList }));
  export const UpsertWorkflow     = createAction(ActionTypes.UpsertWorkflow,
    (workflow: Workflow) => ({ workflow }));
  export const UpdateWorkflowList = createAction(ActionTypes.UpdateWorkflowList,
    (list: Partial<Workflow>[]) => ({ list }));
  export const DeleteWorkflow     = createAction(ActionTypes.DeleteWorkflow, (id: string) => ({ id }));

  export const SelectWorkflow        = createAction(ActionTypes.SelectWorkflow, (id: string) => ({ id }));
  export const SelectWorkflowAndStep = createAction(ActionTypes.SelectWorkflowAndStep,
    (workflowId: string, id: string) => ({ workflowId, id }));
  export const SelectStep            = createAction(ActionTypes.SelectStep, (id: string) => ({ id }));
}
