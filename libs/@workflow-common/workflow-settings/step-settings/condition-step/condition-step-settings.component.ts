import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ConditionParameterType,
  getStepParametersConfig,
  StepType,
  WorkflowStep,
  WorkflowStepParameter
} from '@common/public-api';

import { StepSettingsView } from '../step-settings.component';
import { ItemSource } from '@tools-shared/code-editor/used-value.service';

@Component({
  selector: 'ub-condition-step-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./condition-step-settings.component.scss'],
  template: `
    <p class="description">
      Return <span class="code-sample">true</span> or <span class="code-sample">false</span> value to identify which
      step will be executed next.
    </p>
    <ub-code-editor
      [resizable]="true"
      [model]="codeParam.value"
      (modelChange)="updateCode($event)"
      [prevStepType]="prevStepType"
    ></ub-code-editor>
  `
})
export class ConditionStepSettingsComponent implements StepSettingsView {
  @Input() prevStepType: StepType | ItemSource.EVENT = ItemSource.EVENT;

  @Input() set step(step: WorkflowStep) {
    const { code, steps }: { [key: string]: WorkflowStepParameter } = getStepParametersConfig(
      step.params,
      Object.values(ConditionParameterType)
    );
    this.codeParam = code;
    this.stepsParam = steps;
  }

  codeParam: WorkflowStepParameter;
  stepsParam: WorkflowStepParameter;

  @Output() paramsChange: EventEmitter<WorkflowStepParameter[]> = new EventEmitter<WorkflowStepParameter[]>();

  updateCode(code: string) {
    this.paramsChange.emit([
      {
        ...this.codeParam,
        value: code
      },
      this.stepsParam
    ]);
  }
}
