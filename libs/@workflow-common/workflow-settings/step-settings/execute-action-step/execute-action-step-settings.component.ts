import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { map, withLatestFrom } from 'rxjs/operators';

import {
  ExecuteActionParameterType,
  getStepParametersConfig,
  ParameterValueType,
  StepType,
  WorkflowStep,
  WorkflowStepParameter
} from '@common/public-api';
import { ItemSource } from '@tools-shared/code-editor/used-value.service';
import { WorkflowFacade } from '@tools-state/data/workflow/workflow-facade.service';
import { StepSettingsView } from '../step-settings.component';

@Component({
  selector       : 'ub-execute-action-step-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <label class="workflow-label">
      Action
      <tri-select placeholder="select" [value]="selected" (change)="select($event)">
        <tri-option *ngFor="let action of actions$ | async" [value]="action.id"> {{ action.name }}</tri-option>
      </tri-select>
    </label>
  `
})
export class ExecuteActionStepSettingsComponent implements StepSettingsView {
  actions$ = this.workflowFacade.workflowList$.pipe(
    withLatestFrom(this.workflowFacade.activeWorkflowId$),
    map(([workflowList, activeId]) => workflowList.filter(workflow => workflow.id !== activeId))
  );

  selected: string;
  @Input() prevStepType: StepType | ItemSource.EVENT = ItemSource.EVENT;

  @Input() set step(step: WorkflowStep) {
    const { action }: { [key: string]: WorkflowStepParameter } = getStepParametersConfig(
      step.params,
      Object.values(ExecuteActionParameterType)
    );
    this.selected                                              = action.value;
  }

  @Output() paramsChange: EventEmitter<WorkflowStepParameter[]> = new EventEmitter<WorkflowStepParameter[]>();

  constructor(private workflowFacade: WorkflowFacade) {
  }

  select(actionType: string) {
    this.paramsChange.emit([
      {
        type     : ExecuteActionParameterType.ACTION,
        value    : actionType,
        valueType: ParameterValueType.STRING
      }
    ]);
  }
}
