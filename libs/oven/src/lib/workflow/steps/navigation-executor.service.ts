import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  getStepParametersConfig,
  NavigationParameterType,
  StepType,
  WorkflowStep,
  WorkflowStepParameter,
  Scope
} from '@common';
import { combineLatest, Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap } from 'rxjs/operators';

import { StepExecutor } from '../step-executor.model';
import { ExecutorUtilService } from '../util/executor-util.service';

@Injectable()
export class NavigationExecutorService implements StepExecutor {
  type = StepType.NAVIGATION;

  private paramTypes: string[] = Object.values(NavigationParameterType);

  constructor(private router: Router, private executorUtils: ExecutorUtilService) {
  }

  execute(scope: Scope, step: WorkflowStep): Observable<any> {
    const stepParameters = step.params;

    const params: { [name: string]: WorkflowStepParameter } = getStepParametersConfig(stepParameters, this.paramTypes);

    const urlParam: WorkflowStepParameter = params[NavigationParameterType.URL];
    const queryParamParam: WorkflowStepParameter = params[NavigationParameterType.QUERY_PARAMS];
    const queryParams = this.executorUtils.interpolateCustomParams(queryParamParam, scope);
    const urlString: string = this.executorUtils.interpolateString(urlParam.value, scope);
    const urlTree = this.router.createUrlTree([urlString], { queryParams: queryParams });

    return fromPromise(this.router.navigateByUrl(urlTree));
  }
}
