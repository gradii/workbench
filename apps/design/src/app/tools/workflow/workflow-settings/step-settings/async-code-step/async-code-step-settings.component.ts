import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CustomAsyncCodeParameterType, getStepParametersConfig, WorkflowStep, WorkflowStepParameter } from '@common';

import { CodeStepSettingsComponent } from '../code-step/code-step-settings.component';

@Component({
  selector: 'ub-async-code-step-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ub-code-editor
      [resizable]="true"
      [model]="code.value"
      (modelChange)="updateCode($event)"
      [prevStepType]="prevStepType"
    ></ub-code-editor>
  `
})
export class AsyncCodeStepSettingsComponent extends CodeStepSettingsComponent {
  @Input() set step(step: WorkflowStep) {
    const { asyncCode }: { [key: string]: WorkflowStepParameter } = getStepParametersConfig(
      step.params,
      Object.values(CustomAsyncCodeParameterType)
    );
    this.code = asyncCode;
    this.cd.detectChanges();
  }
}
