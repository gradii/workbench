import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpRequestParameterType,
  StepType,
  WorkflowStep,
  WorkflowStepParameter,
  getStepParametersConfig,
  Workflow,
  Scope,
  BodyType
} from '@common/public-api';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { GlobalStateService } from '../global-state.service';
import { StepExecutor } from '../step-executor.model';
import { ExecutorUtilService } from '../util/executor-util.service';

export interface RequestOptions {
  body?: any;
  headers?: { [header: string]: string };
  params?: { [param: string]: string };
  withCredentials: boolean;
}

@Injectable()
export class RequestExecutorService implements StepExecutor {
  type = StepType.HTTP_REQUEST;

  private paramTypes: string[] = Object.values(HttpRequestParameterType);

  constructor(
    private globalState: GlobalStateService,
    private executorUtils: ExecutorUtilService,
    private http: HttpClient
  ) {
  }

  execute(scope: Scope, step: WorkflowStep, workflow: Workflow): Observable<any> {
    const stepParameters: WorkflowStepParameter[] = step.params;

    const params: { [name: string]: WorkflowStepParameter } = getStepParametersConfig(stepParameters, this.paramTypes);
    const urlParam: WorkflowStepParameter = params[HttpRequestParameterType.URL];
    const methodParam: WorkflowStepParameter = params[HttpRequestParameterType.METHOD];
    const queryParamsParam: WorkflowStepParameter = params[HttpRequestParameterType.QUERY_PARAMS];
    const headersParam: WorkflowStepParameter = params[HttpRequestParameterType.HEADERS];
    const bodyParam: WorkflowStepParameter = params[HttpRequestParameterType.BODY];
    const bodyTypeParam: WorkflowStepParameter = params[HttpRequestParameterType.BODY_TYPE];
    const withCredentials: WorkflowStepParameter = params[HttpRequestParameterType.WITH_CREDENTIALS];

    const url: string = this.executorUtils.interpolateString(urlParam.value, scope);
    const options: RequestOptions = this.getRequestOptions(
      queryParamsParam,
      headersParam,
      bodyParam,
      bodyTypeParam,
      withCredentials.value,
      scope
    );

    return this.http.request(methodParam.value, url, options);
  }

  private getRequestOptions(
    queryParamsParam: WorkflowStepParameter,
    headersParam: WorkflowStepParameter,
    bodyParam: WorkflowStepParameter,
    bodyTypeParam: WorkflowStepParameter,
    withCredentials: boolean,
    scope: Scope
  ): RequestOptions {
    const headers = this.executorUtils.interpolateCustomParams(headersParam, scope);
    const queryParams = this.executorUtils.interpolateCustomParams(queryParamsParam, scope);

    const result: RequestOptions = {
      params: queryParams,
      headers: headers,
      withCredentials
    };

    if (bodyParam?.value) {
      result.body = this.interpolateBody(bodyParam.value, bodyTypeParam.value, scope);
    }

    return result;
  }

  private interpolateBody(content: string, bodyType: BodyType, scope: Scope): string {
    if (bodyType === BodyType.RAW) {
      return this.executorUtils.interpolateString(content, scope);
    }
    if (bodyType === BodyType.OBJECT) {
      return this.executorUtils.executeCode(content, scope);
    }
  }
}
