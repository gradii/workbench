import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Workflow } from '@common';

import { WorkflowActions } from '@tools-state/data/workflow/workflow.actions';

export namespace fromWorkflow {
  export interface State extends EntityState<Workflow> {
    ids: string[];
    activeWorkflowId: string;
    activeStepId: string;
  }

  const adapter: EntityAdapter<Workflow> = createEntityAdapter<Workflow>();

  const initialState: State = adapter.getInitialState({
    ids: [],
    activeWorkflowId: '',
    activeStepId: ''
  });

  export const reducer = createReducer(
    initialState,
    on(WorkflowActions.addWorkflowList, (state, { workflowList }) => {
      let activeWorkflowId = state.activeWorkflowId;
      let activeStepId = state.activeStepId;
      if (!activeWorkflowId && workflowList.length > 1) {
        const activeWorkflow = workflowList.find(workflow => workflow.id !== 'toggleSidebar');
        activeWorkflowId = activeWorkflow.id;
        activeStepId = activeWorkflow.steps[0]?.id;
      }
      return {
        ...adapter.setAll(workflowList, state),
        activeWorkflowId,
        activeStepId
      };
    }),
    on(WorkflowActions.updateWorkflowList, (state, { list }) => adapter.updateMany(list, state)),
    on(WorkflowActions.upsertWorkflow, (state, { workflow }) => adapter.upsertOne(workflow, state)),
    on(WorkflowActions.deleteWorkflow, (state, { id }) => adapter.removeOne(id, state)),

    on(WorkflowActions.selectWorkflow, (state, { id }) => ({
      ...state,
      activeWorkflowId: id
    })),
    on(WorkflowActions.selectWorkflowAndStep, (state, { workflowId, id }) => ({
      ...state,
      activeWorkflowId: workflowId,
      activeStepId: id
    })),
    on(WorkflowActions.selectStep, (state, { id }) => ({
      ...state,
      activeStepId: id
    }))
  );

  export const { selectAll, selectEntities } = adapter.getSelectors();
}
