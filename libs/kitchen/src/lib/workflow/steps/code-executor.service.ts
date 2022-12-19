import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  WorkflowStep,
  CustomCodeParameterType,
  WorkflowStepParameter,
  StepType,
  getStepParametersConfig,
  Scope
} from '@common/public-api';

import { StepExecutor } from '../step-executor.model';
import { ExecutorUtilService } from '../util/executor-util.service';

@Injectable()
export class CodeExecutorService implements StepExecutor {
  type = StepType.CUSTOM_CODE;

  private paramTypes: string[] = Object.values(CustomCodeParameterType);

  constructor(private executorUtils: ExecutorUtilService) {
  }

  execute(scope: Scope, step: WorkflowStep): Observable<any> {
    const stepParameters = step.params;

    const params: { [name: string]: WorkflowStepParameter } = getStepParametersConfig(stepParameters, this.paramTypes);
    const codeParam: WorkflowStepParameter = params[CustomCodeParameterType.CODE];
    const codeString: string = codeParam.value;

    return of(this.executorUtils.executeCustomCode(codeString, scope));
  }
}
