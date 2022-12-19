import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WorkflowStep, WorkflowStepParameter } from '@common/public-api';

import { WorkflowUtilsService } from '@tools-state/data/workflow/workflow-utils.service';

@Component({
  selector: 'ub-step-list-group',
  styleUrls: ['step-list-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ub-step-list
      [steps]="steps"
      [activeStepId]="activeStepId"
      [workflowId]="workflowId"
      [nestedLevel]="nestedLevel"
    ></ub-step-list>

    <div class="nested-step-list-groups" *ngIf="nestedStepsList">
      <ub-step-list-group
        *ngFor="let nestedSteps of nestedStepsList; let i = index"
        [steps]="nestedSteps"
        [nestedLevel]="nestedLevel + 1"
        [activeStepId]="activeStepId"
        [workflowId]="workflowId"
      ></ub-step-list-group>
    </div>
  `
})
export class StepListGroupComponent {
  steps: WorkflowStep[];
  nestedStepsList: WorkflowStep[][];

  @Input() activeStepId: string;
  @Input() workflowId: string;

  @Input('steps')
  set stepsSetter(steps: WorkflowStep[]) {
    this.steps = steps;

    if (!steps) {
      return;
    }

    const conditionStepParam: WorkflowStepParameter = this.workflowUtilService.findConditionParamInSteps(steps);
    if (!conditionStepParam) {
      this.nestedStepsList = null;
      return;
    }
    this.nestedStepsList = (conditionStepParam.value as { steps: WorkflowStep[] }[]).map(value => value.steps);
  }

  @Input() nestedLevel = 0;

  constructor(private workflowUtilService: WorkflowUtilsService) {
  }
}
