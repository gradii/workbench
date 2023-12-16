import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Workflow } from '@common';

export namespace WorkflowActions {
  export enum ActionTypes {
    AddWorkflowList = '[Workflow] Add Workflow List',
    UpsertWorkflow = '[Workflow] Upsert Workflow',
    UpdateWorkflowList = '[Workflow] Update Workflow List',
    DeleteWorkflow = '[Workflow] Delete Workflow',

    SelectWorkflow = '[Workflow] Select Workflow',
    SelectWorkflowAndStep = '[Workflow] Select Workflow Step',
    SelectStep = '[Workflow] Select Step',
  }

  export const addWorkflowList = createAction(ActionTypes.AddWorkflowList, props<{ workflowList: Workflow[] }>());
  export const upsertWorkflow = createAction(ActionTypes.UpsertWorkflow, props<{ workflow: Workflow }>());
  export const updateWorkflowList = createAction(ActionTypes.UpdateWorkflowList, props<{ list: Update<Workflow>[] }>());
  export const deleteWorkflow = createAction(ActionTypes.DeleteWorkflow, props<{ id: string }>());

  export const selectWorkflow = createAction(ActionTypes.SelectWorkflow, props<{ id: string }>());
  export const selectWorkflowAndStep = createAction(
    ActionTypes.SelectWorkflowAndStep,
    props<{ workflowId: string; id: string }>()
  );
  export const selectStep = createAction(ActionTypes.SelectStep, props<{ id: string }>());
}
