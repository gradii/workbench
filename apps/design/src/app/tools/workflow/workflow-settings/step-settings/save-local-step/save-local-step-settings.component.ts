import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  getStepParametersConfig,
  StepType,
  WorkflowStep,
  WorkflowStepParameter,
  PutInLocalStorageParameterType
} from '@common';
import { StepUtilService } from '@tools-state/data/step-util.service';
import { ItemSource } from '@tools-shared/code-editor/used-value.service';

import { StepSettingsView } from '../step-settings.component';

@Component({
  selector: 'ub-save-local-step-settings',
  styleUrls: ['./save-local-step-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="workflow-label">Local Storage Variable</label>
    <ub-local-storage-item-name [itemId]="storageItemId" (selectItem)="selectItem($event)"></ub-local-storage-item-name>

    <label class="workflow-label">Value</label>
    <ub-code-editor
      syntax="text"
      [model]="storageItemValue"
      (modelChange)="changeValue($event)"
      [prevStepType]="prevStepType"
    >
    </ub-code-editor>
  `
})
export class SaveLocalStepSettingsComponent implements StepSettingsView {
  @Input() prevStepType: StepType | ItemSource.EVENT = ItemSource.EVENT;

  storageItemId: string;
  storageItemValue: string;

  @Input() set step(step: WorkflowStep) {
    this._step = step;

    const params: { [key: string]: WorkflowStepParameter } = getStepParametersConfig(
      step.params,
      Object.values(PutInLocalStorageParameterType)
    );
    const nameParam: WorkflowStepParameter = params[PutInLocalStorageParameterType.STORAGE_ITEM_ID];
    const valueParam: WorkflowStepParameter = params[PutInLocalStorageParameterType.VALUE];

    this.storageItemId = nameParam.value;
    this.storageItemValue = valueParam.value;
  }

  @Output() paramsChange: EventEmitter<WorkflowStepParameter[]> = new EventEmitter<WorkflowStepParameter[]>();

  private _step: WorkflowStep;

  constructor(private stepUtils: StepUtilService) {
  }

  selectItem(id: string) {
    const newParams = this.stepUtils.updateParameters(this._step.params, {
      [PutInLocalStorageParameterType.STORAGE_ITEM_ID]: { value: id }
    });
    this.paramsChange.emit(newParams);
  }

  changeValue(value: string) {
    const newParams = this.stepUtils.updateParameters(this._step.params, {
      [PutInLocalStorageParameterType.VALUE]: { value }
    });
    this.paramsChange.emit(newParams);
  }
}
