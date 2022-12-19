import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import { deleteEntities } from '@ngneat/elf-entities';
import { upsertEntities } from '@ngneat/elf-entities';
import { Workflow } from '@common/public-api';

import { WorkflowActions } from '@tools-state/data/workflow/workflow.actions';
import { EntitiesState, setEntities, updateEntities, withEntities } from '@ngneat/elf-entities';
import { tap } from 'rxjs/operators';

export namespace fromWorkflow {
  export interface State {
    ids: string[];
    activeWorkflowId: string;
    activeStepId: string;
    entities: EntitiesState<Workflow>;
  }

  // const adapter: EntityAdapter<Workflow> = createEntityAdapter<Workflow>();

  const initialState: State = {
    ids             : [],
    activeWorkflowId: '',
    activeStepId    : '',
    entities        : {},
  };

  const { state, config } = createState(
    withProps<State>(initialState),
    withEntities<Workflow>()
  );

  export const fromWorkflowStore = new Store({ name: 'kitchen-workflow', state, config });


  export class ReducerEffect {
    reducerEffect = createEffect(
      (actions) => actions.pipe(
        tap((action) => {
          switch (action.type) {
            case WorkflowActions.ActionTypes.AddWorkflowList:
              const { workflowList } = action;
              let activeWorkflowId   = state.activeWorkflowId;
              let activeStepId       = state.activeStepId;
              if (!activeWorkflowId && workflowList.length > 1) {
                const activeWorkflow = workflowList.find(workflow => workflow.id !== 'toggleSidebar');
                activeWorkflowId     = activeWorkflow.id;
                activeStepId         = activeWorkflow.steps[0]?.id;
              }

              fromWorkflowStore.update(setEntities(workflowList));

              return fromWorkflowStore.update((state) => ({
                ...state,
                activeWorkflowId,
                activeStepId
              }));
            case WorkflowActions.ActionTypes.UpdateWorkflowList:
              return action.list.forEach(it => {
                fromWorkflowStore.update(updateEntities(it.id, it));
              });
            case WorkflowActions.ActionTypes.UpsertWorkflow:
              return fromWorkflowStore.update(upsertEntities(action.workflow));
            case WorkflowActions.ActionTypes.DeleteWorkflow:
              return fromWorkflowStore.update(deleteEntities(action.id));
            case WorkflowActions.ActionTypes.SelectWorkflow:
              return fromWorkflowStore.update((state) => ({
                ...state,
                activeWorkflowId: action.id
              }));
            case WorkflowActions.ActionTypes.SelectWorkflowAndStep:
              return fromWorkflowStore.update((state) => ({
                ...state,
                activeWorkflowId: action.workflowId,
                activeStepId    : action.stepId
              }));
            case WorkflowActions.ActionTypes.SelectStep:
              return fromWorkflowStore.update((state) => ({
                ...state,
                activeStepId: action.id
              }));
            default:
          }
        })
      )
    );
  }

  // export const reducer = createReducer(
  //   initialState,
  //   on(WorkflowActions.addWorkflowList, (state, { workflowList }) => {
  //     let activeWorkflowId = state.activeWorkflowId;
  //     let activeStepId     = state.activeStepId;
  //     if (!activeWorkflowId && workflowList.length > 1) {
  //       const activeWorkflow = workflowList.find(workflow => workflow.id !== 'toggleSidebar');
  //       activeWorkflowId     = activeWorkflow.id;
  //       activeStepId         = activeWorkflow.steps[0]?.id;
  //     }
  //     return {
  //       ...adapter.setAll(workflowList, state),
  //       activeWorkflowId,
  //       activeStepId
  //     };
  //   }),
  //   on(WorkflowActions.updateWorkflowList, (state, { list }) => adapter.updateMany(list, state)),
  //   on(WorkflowActions.upsertWorkflow, (state, { workflow }) => adapter.upsertOne(workflow, state)),
  //   on(WorkflowActions.deleteWorkflow, (state, { id }) => adapter.removeOne(id, state)),
  //
  //   on(WorkflowActions.selectWorkflow, (state, { id }) => ({
  //     ...state,
  //     activeWorkflowId: id
  //   })),
  //   on(WorkflowActions.selectWorkflowAndStep, (state, { workflowId, id }) => ({
  //     ...state,
  //     activeWorkflowId: workflowId,
  //     activeStepId    : id
  //   })),
  //   on(WorkflowActions.selectStep, (state, { id }) => ({
  //     ...state,
  //     activeStepId: id
  //   }))
  // );

  // export const { selectAll, selectEntities } = adapter.getSelectors();
}
