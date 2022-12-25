import { TriggeredAction, WorkflowInfo } from '@common/public-api';
import { select } from '@ngneat/elf';
import { selectAllEntities, selectEntity } from '@ngneat/elf-entities';
import { PuffComponent } from '@tools-state/component/component.model';
import { getComponentList } from '@tools-state/component/component.selectors';

import { fromWorkflow } from '@tools-state/data/workflow/workflow.reducer';
import { combineLatest } from 'rxjs';

export const getWorkflowState = fromWorkflow.fromWorkflowStore;

export const getWorkflowList = getWorkflowState.pipe(selectAllEntities());

export const getActiveWorkflowId = getWorkflowState.pipe(select(({ activeWorkflowId }) => activeWorkflowId));

export const getActiveWorkflow = getWorkflowState.pipe(select(
  (state: fromWorkflow.State) => state.entities[state.activeWorkflowId]
));

export const getActiveStepId = getWorkflowState.pipe(select(({ activeStepId }) => activeStepId));

export const getWorkflowEntities = getWorkflowState.pipe(selectAllEntities());

export const getWorkflowNameById = (id: string) => getWorkflowState.pipe(
  selectEntity(id, { pluck: 'name' })
);

export const getWorkflowById = (id: string) => getWorkflowState.pipe(
  selectEntity(id)
);

export const getWorkflowsAssignedStatus = getComponentList.pipe(select((components: PuffComponent[]): {
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
        const { action }               = triggeredAction;
        workflowAssignedStatus[action] = true;
      }
    }
  }
  return workflowAssignedStatus;
}));

export const getWorkflowInfoList = combineLatest(
  [
    getWorkflowList,
    getWorkflowsAssignedStatus
  ]).pipe(
  select(([
            workflowList,
            workflowsAssignedStatus
          ]): WorkflowInfo[] => {
    return workflowList.map(workflow => ({
      ...workflow,
      assigned: workflowsAssignedStatus[workflow.id] || false
    }));
  })
);
