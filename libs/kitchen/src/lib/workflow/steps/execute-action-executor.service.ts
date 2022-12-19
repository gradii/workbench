import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  ExecuteActionParameterType,
  getStepParametersConfig,
  Scope,
  StepType,
  Workflow,
  WorkflowStep,
  WorkflowStepParameter
} from '@common/public-api';

import { StepExecutor } from '../step-executor.model';
import { WorkflowExecutorService } from '../workflow-executor.service';

@Injectable()
export class ExecuteActionExecutorService implements StepExecutor {
  type = StepType.EXECUTE_ACTION;

  private paramTypes: string[] = Object.values(ExecuteActionParameterType);

  constructor(private injector: Injector) {
  }

  get workflowExecutor() {
    // to avoid circular dependency we have to get service directly from injector
    return this.injector.get(WorkflowExecutorService);
  }

  execute(scope: Scope, step: WorkflowStep): Observable<any> {
    const stepParameters = step.params;
    const params: { [name: string]: WorkflowStepParameter } = getStepParametersConfig(stepParameters, this.paramTypes);
    const actionParam: WorkflowStepParameter = params[ExecuteActionParameterType.ACTION];

    // we simply execute another action and return the result
    return this.workflowExecutor
      .getWorkflow(actionParam.value)
      .pipe(switchMap((workflow: Workflow) => this.workflowExecutor.run(workflow, scope.values[Scope.RESULT])));
  }
}
