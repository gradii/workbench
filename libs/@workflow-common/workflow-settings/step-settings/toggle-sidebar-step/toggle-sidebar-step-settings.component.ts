import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  getStepParametersConfig,
  ParameterValueType,
  StepType,
  ToggleParameterType,
  WorkflowStep,
  WorkflowStepParameter
} from '@common/public-api';

import { ItemSource } from '@tools-shared/code-editor/used-value.service';
import { StepSettingsView } from '../step-settings.component';

@Component({
  selector: 'ub-toggle-sidebar-step-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="workflow-label">
      Action type
      <tri-select placeholder="select" [value]="selected" (valueChange)="select($event)">
        <tri-option value="open">Open</tri-option>
        <tri-option value="close">Close</tri-option>
        <tri-option value="toggle">Toggle</tri-option>
      </tri-select>
    </label>
  `
})
export class ToggleSidebarStepSettingsComponent implements StepSettingsView {
  selected: string;
  @Input() prevStepType: StepType | ItemSource.EVENT = ItemSource.EVENT;

  @Input() set step(step: WorkflowStep) {
    const { actionType }: { [key: string]: WorkflowStepParameter } = getStepParametersConfig(
      step.params,
      Object.values(ToggleParameterType)
    );
    this.selected = actionType.value;
  }

  @Output() paramsChange: EventEmitter<WorkflowStepParameter[]> = new EventEmitter<WorkflowStepParameter[]>();

  constructor() {
  }

  select(actionType: string) {
    this.paramsChange.emit([
      {
        type: ToggleParameterType.ACTION_TYPE,
        value: actionType,
        valueType: ParameterValueType.STRING
      }
    ]);
  }
}
