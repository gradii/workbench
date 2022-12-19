import {
  ChangeDetectionStrategy,
  ɵmarkDirty,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ɵdetectChanges
} from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  getStepParametersConfig,
  PutInStoreParameterType,
  StepType,
  WorkflowStep,
  WorkflowStepParameter
} from '@common/public-api';

import { StepSettingsView } from '../step-settings.component';
import { StepUtilService } from '@tools-state/data/step-util.service';
import { ItemSource } from '@tools-shared/code-editor/used-value.service';
import { StateManagerDialogService } from '../../../state-manager/dialog/state-manager-dialog.service';

@Component({
  selector: 'ub-save-step-settings',
  styleUrls: ['./save-step-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="workflow-label">App State Variable</label>
    <ub-state-item-name
      [itemId]="storeItemId"
      (selectStoreItem)="selectItem($event)"
      (addStoreItem)="openStateManagerModal()"
    ></ub-state-item-name>

    <label class="workflow-label">Value</label>
    <ub-code-editor
      syntax="ts"
      [lineNumbers]="true"
      [resizable]="true"
      [model]="storeItemValue"
      (modelChange)="changeValue($event)"
      [prevStepType]="prevStepType"
    >
    </ub-code-editor>
  `
})
export class SaveStepSettingsComponent implements StepSettingsView, OnDestroy {
  @Input() prevStepType: StepType | ItemSource.EVENT = ItemSource.EVENT;

  private destroyed: Subject<void> = new Subject<void>();

  storeItemId: string;
  storeItemValue: string;

  @Input() set step(step: WorkflowStep) {
    this._step = step;

    const params: { [key: string]: WorkflowStepParameter } = getStepParametersConfig(
      step.params,
      Object.values(PutInStoreParameterType)
    );
    const storeItemIdParam: WorkflowStepParameter = params[PutInStoreParameterType.STORE_ITEM_ID];
    const valueParam: WorkflowStepParameter = params[PutInStoreParameterType.VALUE];

    this.storeItemId = storeItemIdParam.value;
    this.storeItemValue = valueParam.value;
    ɵdetectChanges(this);
  }

  @Output() paramsChange: EventEmitter<WorkflowStepParameter[]> = new EventEmitter<WorkflowStepParameter[]>();

  private _step: WorkflowStep;

  constructor(
    private stepUtils: StepUtilService,

    private stateManagerDialogService: StateManagerDialogService
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed.next();
  }

  selectItem(id: string) {
    const newParams = this.stepUtils.updateParameters(this._step.params, {
      [PutInStoreParameterType.STORE_ITEM_ID]: { value: id }
    });
    this.paramsChange.emit(newParams);
  }

  changeValue(value: string) {
    const newParams = this.stepUtils.updateParameters(this._step.params, {
      [PutInStoreParameterType.VALUE]: { value }
    });
    this.paramsChange.emit(newParams);
  }

  openStateManagerModal() {
    this.stateManagerDialogService
      .open(true, true)
      .afterClosed().pipe(
      filter(storeItemId => !!storeItemId),
      takeUntil(this.destroyed)
    )
      .subscribe((storeItemId: string) => this.selectItem(storeItemId));
  }
}
