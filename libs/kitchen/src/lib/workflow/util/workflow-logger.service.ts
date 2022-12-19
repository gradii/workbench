import { Injectable } from '@angular/core';
import { AnalyticsService, nextId, StateAction, Workflow, WorkflowLogLevel, WorkflowStep } from '@common/public-api';

import { KitchenState } from '../../state/kitchen-state.service';

@Injectable()
export class WorkflowLogger {
  constructor(private analytics: AnalyticsService, private kitchenState: KitchenState) {
  }

  logWorkflowError(workflow: Workflow, error: Error) {
    this.analytics.logActionExecuted(workflow.id, workflow.name, false, error.message);
  }

  logWorkflowExecution(workflow: Workflow) {
    this.kitchenState.emitMessage(StateAction.WORKFLOW_LOG, {
      id: nextId(),
      workflowId: workflow.id,
      stepId: null,
      level: WorkflowLogLevel.INFO,
      message: 'Action successfully executed'
    });
    this.analytics.logActionExecuted(workflow.id, workflow.name, true);
  }

  logStepError(workflow: Workflow, step: WorkflowStep, error: Error) {
    this.kitchenState.emitMessage(StateAction.WORKFLOW_LOG, {
      id: nextId(),
      workflowId: workflow.id,
      stepId: step.id,
      level: WorkflowLogLevel.ERROR,
      message: error.message
    });
    this.analytics.logActionStepExecuted(workflow.id, step.type, workflow.name, error.message);
  }

  logStepExecution(workflow: Workflow, step: WorkflowStep) {
    this.kitchenState.emitMessage(StateAction.WORKFLOW_LOG, {
      id: nextId(),
      workflowId: workflow.id,
      stepId: step.id,
      level: WorkflowLogLevel.INFO,
      message: 'Step successfully executed'
    });
    this.analytics.logActionStepExecuted(workflow.id, step.type, workflow.name);
  }
}
