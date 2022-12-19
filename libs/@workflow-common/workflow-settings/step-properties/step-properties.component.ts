import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';
import { nextId, StepType, Workflow, WorkflowStep, WorkflowStepParameter } from '@common/public-api';
import { BehaviorSubject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { WorkflowLoggerService } from '@tools-state/data/workflow/workflow-logger.service';
import { WorkflowUtilsService } from '@tools-state/data/workflow/workflow-utils.service';
import { stepInfo } from '../workflow-info.model';
import { WorkflowSourceService } from '../../workflow-source.service';

@Component({
  selector       : 'ub-step-properties',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./step-properties.component.scss'],
  template       : `
    <ub-step-type-select [step]="activeStep" (changeType)="changeStepType($event)"></ub-step-type-select>

    <tri-tab-group *ngIf="activeStep?.type !== 'draft'" class="tabs">
      <tri-tab title="Setup" name="step-setup">
        <ub-step-settings
          [stepInfo]="{ stepId: activeStepId, steps: workflow.steps, workflowId: workflow.id }"
          (paramsChange)="changeParams($event)"
        ></ub-step-settings>
      </tri-tab>

      <tri-tab [title]="errorsTabTitle$ | async" name="step-errors">
        <ub-step-error-list [errors]="errors$ | async"></ub-step-error-list>
      </tri-tab>
    </tri-tab-group>
  `
})
export class StepPropertiesComponent {
  workflow: Workflow;
  activeStepId: string;

  @Input('workflow') set workflowSetter(workflow: Workflow) {
    this.workflow = { ...workflow };
    this.setWorkflowInfo();
  }

  @Input('activeStepId')
  set activeStepIdSetter(value: string) {
    this.activeStepId = value;
    this.setWorkflowInfo();
  }

  @Output() workflowChange: EventEmitter<Workflow> = new EventEmitter<Workflow>();

  get activeStep(): WorkflowStep {
    return this.workflowUtils.getStepById(this.workflow.steps, this.activeStepId);
  }

  workflowInfo    = new BehaviorSubject<{ workflowId: string; stepId: string }>({ workflowId: '', stepId: '' });
  errors$         = this.workflowInfo.asObservable().pipe(
    mergeMap(({ workflowId, stepId }) => this.workflowLogService.getLogsForWorkflow(workflowId, stepId)),
    map(errors => errors || [])
  );
  errorsTabTitle$ = this.errors$.pipe(map(errors => `Errors (${errors.length})`));

  constructor(
    private workflowSourceService: WorkflowSourceService,
    private workflowLogService: WorkflowLoggerService,
    private workflowUtils: WorkflowUtilsService
  ) {
  }

  changeStepType(type: StepType) {
    if (this.activeStep.type === type) {
      return;
    }
    const steps     = JSON.parse(JSON.stringify(this.workflow.steps));
    const newStepId = nextId();

    const currentStep            = this.workflowUtils.getStepById(steps, this.activeStepId);
    let subSteps: WorkflowStep[] = [];
    if (type === StepType.CONDITION) {
      subSteps = this.workflowUtils
        .getAllStepAfterStepById(steps, this.activeStepId)
        .map(step => this.workflowUtils.updateStepLevel(step, currentStep.level + 1));
    }

    const prevStepType = this.workflowUtils.getPreviousResultType(steps, this.activeStepId);

    Object.assign(currentStep, {
      id    : newStepId,
      type,
      params: stepInfo[type].parametersFactory({ prevStepType, subSteps })
    });

    this.workflow.steps = steps;
    this.workflowSourceService.selectStepById(newStepId);
    this.checkUnsavedChangesAndEmit();
  }

  changeParams(update: WorkflowStepParameter[]) {
    const steps       = JSON.parse(JSON.stringify(this.workflow.steps));
    const currentStep = this.workflowUtils.getStepById(steps, this.activeStepId);
    Object.assign(currentStep, {
      params: update
    });
    this.workflow.steps = steps;

    this.checkUnsavedChangesAndEmit();
  }

  private checkUnsavedChangesAndEmit() {
    this.workflowChange.emit(this.workflow);
    ɵmarkDirty(this);
  }

  private setWorkflowInfo(): void {
    this.workflowInfo.next({
      workflowId: this.workflow && this.workflow.id,
      stepId    : this.activeStepId
    });
  }
}
