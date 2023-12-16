import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import {
  ConditionParameterType,
  getUniqueName,
  nextId,
  StepType,
  Workflow,
  WorkflowStep,
  WorkflowStepParameter
} from '@common';

import { WorkflowFacade } from '@tools-state/data/workflow/workflow-facade.service';

@Injectable({ providedIn: 'root' })
export class WorkflowUtilsService {
  constructor(private workflowFacade: WorkflowFacade) {
  }

  findConditionParamInSteps(steps: WorkflowStep[]): WorkflowStepParameter {
    const conditionStep = steps.find(step => step.type === StepType.CONDITION);
    if (!conditionStep) {
      return;
    }

    const conditionParam = conditionStep.params.find(param => param.type === ConditionParameterType.STEPS);
    if (!conditionParam || !Array.isArray(conditionParam.value)) {
      return;
    }

    return conditionParam;
  }

  duplicateWorkflow(workflow: Workflow): Observable<Workflow> {
    return this.workflowFacade.workflowList$.pipe(
      take(1),
      mergeMap((workflowList: Workflow[]) => {
        const uniqueName: string = this.generateUniqueName(workflow.name, workflowList);
        const newWorkflow = JSON.parse(JSON.stringify({ ...workflow, id: nextId(), name: uniqueName }));
        return this.workflowFacade.createWorkflow(newWorkflow);
      })
    );
  }

  initializeWorkflow(list: Workflow[], name?: string): Workflow {
    return {
      id: nextId(),
      name: name || this.generateUniqueName('Untitled Action', list || []),
      steps: [this.initializeStep()]
    };
  }

  initializeStep(level = 0): WorkflowStep {
    return { id: nextId(), type: StepType.DRAFT, params: [], level };
  }

  createWorkflow(assignCmpConfig?: { cmpId: string; trigger: string }): Observable<Workflow> {
    return this.workflowFacade.workflowList$.pipe(
      take(1),
      mergeMap(list => {
        const workflow = this.initializeWorkflow(list);
        return this.workflowFacade.createWorkflow(workflow, assignCmpConfig);
      })
    );
  }

  copy(workflow: Workflow): Workflow {
    let steps = workflow.steps;
    if (!steps || !steps.length) {
      steps = [this.initializeStep()];
    }

    // TODO deep copy?
    return JSON.parse(JSON.stringify({ ...workflow, steps }));
  }

  copySteps(steps: WorkflowStep[]): WorkflowStep[] {
    return JSON.parse(JSON.stringify(steps));
  }

  findNextSelectedStep(deleteStepIndex: number, activeStepIndex: number, steps: WorkflowStep[]): WorkflowStep {
    if (deleteStepIndex < activeStepIndex) {
      activeStepIndex--;
    }

    if (steps.length - 1 < activeStepIndex) {
      activeStepIndex = steps.length - 1;
    }

    return steps[activeStepIndex];
  }

  findNextSelectedWorkflow(workflowList: Workflow[], deletedWorkflowId): Workflow {
    const deletedWorkflowIndex = workflowList.findIndex(workflow => workflow.id === deletedWorkflowId);
    if (!workflowList[deletedWorkflowIndex + 1]) {
      return workflowList[workflowList.length - 2];
    }
    return workflowList[deletedWorkflowIndex + 1];
  }

  deleteStepById(
    steps: WorkflowStep[],
    stepId: string,
    activeStepId: string,
    previousSteps: WorkflowStep[]
  ): [WorkflowStep[], WorkflowStep] {
    if (!steps.length) {
      return null;
    }

    const deletedStepIndex = steps.findIndex(step => step.id === stepId);
    if (deletedStepIndex !== -1) {
      return this.removeStepFromList(steps, deletedStepIndex, activeStepId, previousSteps);
    }

    const conditionParam = this.findConditionParamInSteps(steps);
    if (!conditionParam) {
      return null;
    }

    for (const value of conditionParam.value as { steps: WorkflowStep[] }[]) {
      let [, possibleNextStep] = this.deleteStepById(value.steps, stepId, activeStepId, steps) || [];
      if (!possibleNextStep) {
        continue;
      }
      const activeStepInCurrentSteps = steps.find(step => step.id === activeStepId);
      if (activeStepInCurrentSteps) {
        possibleNextStep = activeStepInCurrentSteps;
      }

      return [steps, possibleNextStep];
    }
    return [steps, null];
  }

  private removeStepFromList(
    steps: WorkflowStep[],
    index: number,
    activeStepId: string,
    previousSteps: WorkflowStep[]
  ): [WorkflowStep[], WorkflowStep] {
    const activeStepIndex = steps.findIndex(step => step.id === activeStepId);
    steps.splice(index, 1);

    let nextStep =
      activeStepIndex === -1
        ? this.getStepById(steps, activeStepId)
        : this.findNextSelectedStep(index, activeStepIndex, steps);

    if (!nextStep && previousSteps) {
      const activeStepInPreviousSteps = previousSteps.find(step => step.id === activeStepId);
      nextStep = activeStepInPreviousSteps ? activeStepInPreviousSteps : previousSteps[previousSteps.length - 1];
    }
    if (!nextStep && !previousSteps) {
      nextStep = steps[steps.length - 1];
    }
    return [steps, nextStep];
  }

  addNestedStep(stepId: string, steps: WorkflowStep[], step: WorkflowStep, condition: boolean): WorkflowStep[] {
    const neededStep = this.getStepById(steps, stepId);

    const conditionParam = neededStep.params.find(param => param.type === ConditionParameterType.STEPS);
    if (!conditionParam) {
      return steps;
    }

    const neededValue = (conditionParam.value as { steps: WorkflowStep[]; condition: boolean }[]).find(
      value => value.condition === condition
    );

    if (!neededValue) {
      return steps;
    }

    neededValue.steps.splice(0, 0, step);
    return steps;
  }

  addStepAfter(stepId: string, steps: WorkflowStep[], newStep: WorkflowStep): WorkflowStep[] {
    const neededIndex = steps.findIndex(step => step.id === stepId);
    if (neededIndex !== -1) {
      steps.splice(neededIndex + 1, 0, newStep);
      return steps;
    }

    const conditionParam = this.findConditionParamInSteps(steps);
    if (!conditionParam) {
      return null;
    }

    (conditionParam.value as { steps: WorkflowStep[] }[]).map(value => this.addStepAfter(stepId, value.steps, newStep));

    return steps;
  }

  updateStepLevel(step: WorkflowStep, level: number): WorkflowStep {
    step.level = level;
    if (step.type === StepType.CONDITION) {
      const stepsParam = step.params.find(param => param.type === ConditionParameterType.STEPS);
      (stepsParam.value as { steps: WorkflowStep[] }[]).map(value => {
        return value.steps.map(nestedStep => this.updateStepLevel(nestedStep, level + 1));
      });
    }

    return step;
  }

  getAllStepAfterStepById(steps: WorkflowStep[], stepId: string): WorkflowStep[] {
    const neededStepIndex = steps.findIndex(step => step.id === stepId);
    if (neededStepIndex !== -1) {
      return steps.splice(neededStepIndex + 1);
    }

    const conditionParam = this.findConditionParamInSteps(steps);
    if (!conditionParam) {
      return null;
    }

    return (
      (conditionParam.value as { steps: WorkflowStep[] }[])
        .map(value => this.getAllStepAfterStepById(value.steps, stepId))
        .filter(step => !!step)[0] || []
    );
  }

  getStepById(steps: WorkflowStep[], stepId: string): WorkflowStep {
    let neededStep = steps.find(step => step.id === stepId);
    if (neededStep) {
      return neededStep;
    }

    const conditionParam = this.findConditionParamInSteps(steps);
    if (!conditionParam) {
      return null;
    }

    neededStep = (conditionParam.value as { steps: WorkflowStep[] }[])
      .map(value => this.getStepById(value.steps, stepId))
      .filter(step => !!step)[0];

    return neededStep;
  }

  getPreviousStepByStepId(steps: WorkflowStep[], stepId: string, previousSteps: WorkflowStep[]): WorkflowStep {
    if (!steps.length) {
      return null;
    }

    const neededStepIndex = steps.findIndex(step => step.id === stepId);
    if (neededStepIndex !== -1) {
      const previousStep = steps[neededStepIndex - 1];
      if (!previousStep && previousSteps) {
        return previousSteps[previousSteps.length - 1];
      }
      return previousStep;
    }

    const conditionParam = this.findConditionParamInSteps(steps);
    if (!conditionParam) {
      return null;
    }

    for (const value of conditionParam.value as { steps: WorkflowStep[] }[]) {
      const neededStep = this.getPreviousStepByStepId(value.steps, stepId, steps);
      if (neededStep) {
        return neededStep;
      }
    }

    return steps[steps.length - 1];
  }

  getPreviousResultType(steps: WorkflowStep[], stepId: string): StepType {
    const previousStep = this.getPreviousStepByStepId(steps, stepId, null);
    if (previousStep) {
      const type = previousStep.type;
      if (
        type === StepType.EXECUTE_ACTION ||
        type === StepType.HTTP_REQUEST ||
        type === StepType.CUSTOM_CODE ||
        type === StepType.CUSTOM_ASYNC_CODE
      ) {
        return type;
      } else {
        return this.getPreviousResultType(steps, previousStep.id);
      }
    }
    return null;
  }

  private generateUniqueName(nextName: string, list: Workflow[]) {
    const takenNames: string[] = list.map((wf: Workflow) => wf.name);
    return getUniqueName(takenNames, nextName);
  }
}
