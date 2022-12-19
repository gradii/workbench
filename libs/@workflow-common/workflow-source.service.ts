import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyticsService, Workflow, WorkflowStep } from '@common/public-api';
import { take } from 'rxjs/operators';

import { WorkflowFacade } from '@tools-state/data/workflow/workflow-facade.service';
import { WorkflowUtilsService } from '@tools-state/data/workflow/workflow-utils.service';

@Injectable()
export class WorkflowSourceService {
  readonly currentWorkflow$: Observable<Workflow> = this.workflowFacade.activeWorkflow$;

  constructor(
    private workflowFacade: WorkflowFacade,
    private analytics: AnalyticsService,
    private workflowUtilsService: WorkflowUtilsService
  ) {
  }

  addNewStep(stepId: string, level: number) {
    this.addStepAfter(stepId, this.workflowUtilsService.initializeStep(level));
  }

  addNestedStep(stepId: string, condition: boolean, level: number) {
    this.currentWorkflow$.pipe(take(1)).subscribe((workflow: Workflow) => {
      const newStep = this.workflowUtilsService.initializeStep(level);
      const copiedSteps = this.workflowUtilsService.copySteps(workflow.steps);
      const steps = this.workflowUtilsService.addNestedStep(stepId, copiedSteps, newStep, condition);
      this.selectStepById(newStep.id);
      this.updateCurrentWorkflowSteps(steps);
    });
  }

  addStepAfter(stepId: string, step: WorkflowStep) {
    this.currentWorkflow$.pipe(take(1)).subscribe((workflow: Workflow) => {
      const copiedSteps = this.workflowUtilsService.copySteps(workflow.steps);
      const steps = this.workflowUtilsService.addStepAfter(stepId, copiedSteps, step) || [];
      if (!steps) {
        return;
      }
      this.selectStepById(step.id);
      this.updateCurrentWorkflowSteps(steps);
    });
  }

  deleteStep(stepId: string, activeStepId: string) {
    this.currentWorkflow$.pipe(take(1)).subscribe((workflow: Workflow) => {
      const copiedSteps = this.workflowUtilsService.copySteps(workflow.steps);
      const [steps, nextStep] = this.workflowUtilsService.deleteStepById(copiedSteps, stepId, activeStepId, null) || [];
      if (!steps) {
        return;
      }
      if (nextStep) {
        this.selectStepById(nextStep.id);
      }
      this.updateCurrentWorkflowSteps(steps);
    });
  }

  updateCurrentWorkflow(workflow: Workflow) {
    this.workflowFacade.saveWorkflow(workflow);
  }

  selectWorkflow(workflow: Workflow) {
    const { id, steps } = workflow;
    if (!steps.length) {
      this.selectWorkflowById(id);
    } else {
      const [{ id: stepId }] = steps;
      this.selectWorkflowAndStepById(id, stepId);
    }
  }

  selectFirstStep() {
    this.currentWorkflow$.pipe(take(1)).subscribe((workflow: Workflow) => {
      if (!workflow) {
        return;
      }
      const [{ id }] = workflow.steps;
      this.selectStepById(id);
    });
  }

  selectWorkflowById(id: string) {
    this.workflowFacade.setActiveWorkflowId(id);
  }

  selectWorkflowAndStepById(workflowId: string, id: string) {
    this.workflowFacade.setActiveWorkflowAndStepId(workflowId, id);
  }

  selectStepById(id: string) {
    this.workflowFacade.setActiveStepId(id);
    this.logStepOpen(id);
  }

  private updateCurrentWorkflowSteps(steps: WorkflowStep[]) {
    this.currentWorkflow$
      .pipe(take(1))
      .subscribe((workflow: Workflow) => this.updateCurrentWorkflow({ ...workflow, steps }));
  }

  private logStepOpen(stepId: string): void {
    this.currentWorkflow$.pipe(take(1)).subscribe((workflow: Workflow) => {
      if (!workflow) {
        return;
      }

      const step: WorkflowStep = workflow.steps.find(({ id }) => id === stepId);
      if (!step) {
        return;
      }
      this.analytics.logActionStepOpen(workflow.name, workflow.id, step.type, stepId);
    });
  }
}
