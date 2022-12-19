import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ɵdetectChanges } from '@angular/core';
import {
  CustomCodeParameterType, getStepParametersConfig, StepType, WorkflowStep, WorkflowStepParameter
} from '@common/public-api';
import { ItemSource } from '@tools-shared/code-editor/used-value.service';

import { StepSettingsView } from '../step-settings.component';

@Component({
  selector: 'ub-code-step-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ub-code-editor
      [model]="code.value"
      [resizable]="true"
      [lineNumbers]="true"
      [prevStepType]="prevStepType"
      (modelChange)="updateCode($event)"
    ></ub-code-editor>
  `
})
export class CodeStepSettingsComponent implements StepSettingsView {
  @Input() prevStepType: StepType | ItemSource.EVENT = ItemSource.EVENT;

  @Input() set step(step: WorkflowStep) {
    const { code }: { [key: string]: WorkflowStepParameter } = getStepParametersConfig(
      step.params,
      Object.values(CustomCodeParameterType)
    );
    this.code = code;
    ɵdetectChanges(this);
  }

  code: WorkflowStepParameter;

  @Output() paramsChange: EventEmitter<WorkflowStepParameter[]> = new EventEmitter<WorkflowStepParameter[]>();

  constructor() {
  }

  updateCode(value: string) {
    this.paramsChange.emit([{ ...this.code, value }]);
  }
}
