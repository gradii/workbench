import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  getStepParametersConfig,
  PutInLocalStorageParameterType,
  StateAction,
  StepType,
  WorkflowStep,
  WorkflowStepParameter,
  Scope
} from '@common';

import { StepExecutor } from '../step-executor.model';
import { ExecutorUtilService } from '../util/executor-util.service';
import { OvenState } from '../../state/oven-state.service';

@Injectable()
export class PutInLocalStorageExecutorService implements StepExecutor {
  type = StepType.PUT_IN_LOCAL_STORAGE;

  private paramTypes: string[] = Object.values(PutInLocalStorageParameterType);

  constructor(private ovenState: OvenState, private executorUtils: ExecutorUtilService) {
  }

  execute(scope: Scope, step: WorkflowStep): Observable<any> {
    const stepParameters = step.params;

    const params: { [name: string]: WorkflowStepParameter } = getStepParametersConfig(stepParameters, this.paramTypes);
    const nameParam: WorkflowStepParameter = params[PutInLocalStorageParameterType.STORAGE_ITEM_ID];
    const valueParam: WorkflowStepParameter = params[PutInLocalStorageParameterType.VALUE];
    const nameValue = nameParam.value;
    const code: string = valueParam.value;
    const result = this.executorUtils.executeCode(code, scope);

    this.updateLocalStorageItem(nameValue, result);

    return of(null);
  }

  private updateLocalStorageItem(id: string, value: string) {
    if (value !== undefined) {
      value = JSON.parse(JSON.stringify(value));
    }
    this.ovenState.emitMessage(StateAction.UPDATE_LOCAL_STORAGE_ITEM, { name: id, value });
  }
}
