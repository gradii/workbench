import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  WorkflowStep,
  CustomAsyncCodeParameterType,
  WorkflowStepParameter,
  StepType,
  getStepParametersConfig,
  Scope
} from '@common/public-api';

import { StepExecutor } from '../step-executor.model';
import { ExecutorUtilService } from '../util/executor-util.service';

@Injectable()
export class AsyncCodeExecutorService implements StepExecutor {
  type = StepType.CUSTOM_ASYNC_CODE;

  private paramTypes: string[] = Object.values(CustomAsyncCodeParameterType);

  constructor(private executorUtils: ExecutorUtilService) {
  }

  execute(scope: Scope, step: WorkflowStep): Observable<any> {
    const stepParameters = step.params;

    const params: { [name: string]: WorkflowStepParameter } = getStepParametersConfig(stepParameters, this.paramTypes);
    const codeParam: WorkflowStepParameter = params[CustomAsyncCodeParameterType.ASYNC_CODE];
    const codeString: string = codeParam.value;

    return this.executorUtils.executeAsyncCodeUNSAFE(codeString, scope);
  }
}
