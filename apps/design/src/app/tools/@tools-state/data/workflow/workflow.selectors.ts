import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { TriggeredAction, Workflow, WorkflowInfo } from '@common';

import { fromWorkflow } from '@tools-state/data/workflow/workflow.reducer';
import { fromTools } from '@tools-state/tools.reducer';
import { getToolsState } from '@tools-state/tools.selector';
import { getComponentList } from '@tools-state/component/component.selectors';
import { BakeryComponent } from '@tools-state/component/component.model';

export const getWorkflowState = createSelector(getToolsState, (state: fromTools.State) => state.workflow);

export const getWorkflowList = createSelector(getWorkflowState, fromWorkflow.selectAll);

export const getActiveWorkflowId = createSelector(getWorkflowState, ({ activeWorkflowId }) => activeWorkflowId);

export const getActiveWorkflow = createSelector(
  getWorkflowState,
  (state: fromWorkflow.State) => state.entities[state.activeWorkflowId]
);

export const getActiveStepId = createSelector(getWorkflowState, ({ activeStepId }) => activeStepId);

export const getWorkflowEntities = createSelector(getWorkflowState, fromWorkflow.selectEntities);

export const getWorkflowNameById = createSelector(getWorkflowEntities, (entities: Dictionary<Workflow>, id: string) => {
  return entities[id].name;
});

export const getWorkflowById = createSelector(getWorkflowEntities, (entities: Dictionary<Workflow>, id: string) => {
  return entities[id];
});

export const getWorkflowsAssignedStatus = createSelector(getComponentList, (components: BakeryComponent[]): {
  [key: string]: boolean;
} => {
  const workflowAssignedStatus: { [key: string]: boolean } = {};

  for (const component of components) {
    const actions: { [key: string]: TriggeredAction[] } = component.actions;

    if (!actions) {
      continue;
    }

    for (const key in actions) {
      if (!actions[key]) {
        continue;
      }
      for (const triggeredAction of actions[key]) {
        const { action } = triggeredAction;
        workflowAssignedStatus[action] = true;
      }
    }
  }
  return workflowAssignedStatus;
});

export const getWorkflowInfoList = createSelector(
  getWorkflowList,
  getWorkflowsAssignedStatus,
  (workflowList, workflowsAssignedStatus): WorkflowInfo[] => {
    return workflowList.map(workflow => ({
      ...workflow,
      assigned: workflowsAssignedStatus[workflow.id] || false
    }));
  }
);
