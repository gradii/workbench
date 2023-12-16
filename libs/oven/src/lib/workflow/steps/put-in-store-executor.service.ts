import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  getStepParametersConfig,
  PutInStoreParameterType,
  StateAction,
  StepType,
  WorkflowStep,
  WorkflowStepParameter,
  Scope
} from '@common';

import { StepExecutor } from '../step-executor.model';
import { GlobalStateService } from '../global-state.service';
import { ExecutorUtilService } from '../util/executor-util.service';
import { OvenState } from '../../state/oven-state.service';

@Injectable()
export class PutInStoreExecutorService implements StepExecutor {
  type = StepType.PUT_IN_STORE;

  private paramTypes: string[] = Object.values(PutInStoreParameterType);

  constructor(
    private globalState: GlobalStateService,
    private ovenState: OvenState,
    private executorUtils: ExecutorUtilService
  ) {
  }

  execute(scope: Scope, step: WorkflowStep): Observable<any> {
    const stepParameters = step.params;

    const params: { [name: string]: WorkflowStepParameter } = getStepParametersConfig(stepParameters, this.paramTypes);

    const storeItemIdParam: WorkflowStepParameter = params[PutInStoreParameterType.STORE_ITEM_ID];
    const valueParam: WorkflowStepParameter = params[PutInStoreParameterType.VALUE];
    const storeItemId: string = storeItemIdParam.value;
    const code: string = valueParam.value;
    const result = this.executorUtils.executeCode(code, scope);

    this.globalState.updateUserItem(storeItemId, result);
    this.updateStoreItem(storeItemId, result);

    return of(null);
  }

  private updateStoreItem(id: string, value: any) {
    if (value !== undefined) {
      value = JSON.parse(JSON.stringify(value));
    }
    this.ovenState.emitMessage(StateAction.UPDATE_STORE_ITEM, { id, changes: { value } });
  }
}
