import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConditionParameterType, nextId, StepType, WorkflowStep } from '@common';
import { filter, take } from 'rxjs/operators';

import { WorkflowSourceService } from '../../workflow-source.service';
import { WorkflowDialogService } from '../../dialog/workflow-dialog.service';

@Component({
  selector: 'ub-step-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./step-list.component.scss'],
  template: `
    <div class="step-container" *ngFor="let step of steps; let i = index; trackBy: trackById">
      <ub-step-list-item
        [step]="step"
        [workflowId]="workflowId"
        [selected]="step.id === activeStepId"
        [contextMenuConfig]="getContextMenuConfig(step)"
        [ngClass]="stepListItemSizeClass"
        (duplicate)="duplicateStep($event)"
        (delete)="deleteStep($event)"
        (click)="selectStep(step)"
      ></ub-step-list-item>

      <ng-container *ngIf="shouldShowAddStepButton(step.type, i)" [ngTemplateOutlet]="stepListAction"></ng-container>

      <ng-template #stepListAction>
        <div *ngIf="!isCondition(step.type); else conditionStepAction" class="action-block default-add-step-action">
          <ub-step-list-action
            (addStep)="addNewStep(step.id)"
            [isLastElement]="isLastElement(step, i)"
          ></ub-step-list-action>
        </div>
      </ng-template>

      <ng-template #conditionStepAction>
        <div class="action-block conditional-add-step-action">
          <ub-step-list-action
            *ngFor="let condition of getConditionButtons(step)"
            [ngClass]="stepListItemSizeClass"
            [condition]="condition"
            [isLastElement]="isLastElement(step, i, condition)"
            (addStep)="addNewNestedStep(step.id, condition)"
          ></ub-step-list-action>
        </div>
      </ng-template>
    </div>
  `
})
export class StepListComponent {
  @Input() steps: WorkflowStep[];
  @Input() workflowId: string;
  @Input() activeStepId: string;
  @Input() nestedLevel: number;

  get stepListItemSizeClass(): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = {};

    if (!this.nestedLevel) {
      return classes;
    }

    if (this.nestedLevel === 1) {
      classes['size-middle'] = true;
    }
    if (this.nestedLevel === 2) {
      classes['size-small'] = true;
    }
    if (this.nestedLevel > 2) {
      classes['size-tiny'] = true;
    }

    classes['nested'] = true;

    return classes;
  }

  constructor(
    private workflowSourceService: WorkflowSourceService,
    private workflowDialogService: WorkflowDialogService
  ) {
  }

  getContextMenuConfig(step: WorkflowStep): { isLastStep: boolean; isNested: boolean; isCondition: boolean } {
    return {
      isLastStep: this.steps.length === 1,
      isNested: !!this.nestedLevel,
      isCondition: step.type === StepType.CONDITION
    };
  }

  trackById(index: number, step: WorkflowStep) {
    return step.id;
  }

  getConditionButtons(step: WorkflowStep): boolean[] {
    const stepsParam = step.params.find(param => param.type === ConditionParameterType.STEPS);
    return (stepsParam.value as { condition: boolean }[]).map(value => value.condition);
  }

  deleteStep(stepId: string) {
    this.workflowDialogService
      .openDeleteStepModal()
      .onClose.pipe(
      filter(status => !!status),
      take(1)
    )
      .subscribe(() => {
        this.workflowSourceService.deleteStep(stepId, this.activeStepId);
      });
  }

  duplicateStep(stepId: string) {
    const stepToCopy = this.steps.find(step => step.id === stepId);
    const stepCopy = JSON.parse(JSON.stringify(stepToCopy));
    stepCopy.id = nextId();
    this.workflowSourceService.addStepAfter(stepToCopy.id, stepCopy);
  }

  addNewStep(stepId: string) {
    this.workflowSourceService.addNewStep(stepId, this.nestedLevel);
  }

  addNewNestedStep(stepId: string, condition: boolean) {
    this.workflowSourceService.addNestedStep(stepId, condition, this.nestedLevel + 1);
  }

  isCondition(stepType: StepType): boolean {
    return stepType === StepType.CONDITION;
  }

  shouldShowAddStepButton(stepType: StepType, index: number): boolean {
    return stepType !== StepType.DRAFT || index !== this.steps.length - 1;
  }

  selectStep(step: WorkflowStep) {
    this.workflowSourceService.selectStepById(step.id);
  }

  isLastElement(step: WorkflowStep, index: number, condition?: boolean): boolean {
    if (step.type !== StepType.CONDITION) {
      return this.steps.length - 1 === index;
    }

    const stepsParam = step.params.find(param => param.type === ConditionParameterType.STEPS);

    const currentValue = (stepsParam.value as { condition: boolean; steps: any[] }[]).find(
      value => value.condition === condition
    );

    return currentValue ? !currentValue.steps.length : false;
  }
}
