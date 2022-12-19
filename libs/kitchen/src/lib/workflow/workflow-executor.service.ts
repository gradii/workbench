import { ErrorHandler, Injectable, OnDestroy } from '@angular/core';
import { ConditionParameterType, Scope, StepType, Workflow, WorkflowStep } from '@common/public-api';
import { EMPTY, MonoTypeOperatorFunction, Observable, of, Subject } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { UnaryFunction } from 'rxjs';
import { identity } from 'rxjs';

import { StepExecutorRegistry } from './step-executor-registry.service';
import { StepExecutor } from './step-executor.model';
import { ScopeService } from './util/scope.service';
import { WorkflowLogger } from './util/workflow-logger.service';
import { WorkflowRegistryService } from './workflow-registry.service';
import { StepExecutionError } from './workflow.utils';


function pipeFromArray<T, R>(fns: Array<UnaryFunction<T, R>>): UnaryFunction<T, R> {
  if (fns.length === 0) {
    return identity as UnaryFunction<any, any>;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return function piped(input: T): R {
    return fns.reduce((prev: any, fn: UnaryFunction<T, R>) => fn(prev), input as any);
  };
}

@Injectable()
export class WorkflowExecutorService implements OnDestroy {
  private destroyed: Subject<void> = new Subject<void>();

  constructor(
    private errorHandler: ErrorHandler,
    private stepExecutorRegistry: StepExecutorRegistry,
    private workflowLogger: WorkflowLogger,
    private scopeService: ScopeService,
    private workflowRegistryService: WorkflowRegistryService
  ) {
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  getWorkflow(workflowId: string): Observable<Workflow> {
    return this.workflowRegistryService.getWorkflow(workflowId);
  }

  run(workflow: Workflow, event: any) {
    const steps = this.makeExecutionArrayFromSteps(workflow, workflow.steps);

    const scope: Scope = this.scopeService.getGlobalScope();
    scope.set(Scope.PARAM, event);

    return of(scope).pipe(
      pipeFromArray(steps),
      tap(
        () => this.workflowLogger.logWorkflowExecution(workflow),
        (error: Error) => this.workflowLogger.logWorkflowError(workflow, error)
      ),
      catchError(() => EMPTY)
    );
  }

  private makeExecutionArrayFromSteps(workflow: Workflow, steps: WorkflowStep[]): MonoTypeOperatorFunction<any>[] {
    return steps
      .filter((step: WorkflowStep) => step.type !== StepType.DRAFT)
      .map((step: WorkflowStep) => this.mapStepToExecution(workflow, step));
  }

  private mapStepToExecution(workflow: Workflow, step: WorkflowStep): MonoTypeOperatorFunction<any> {
    const executor: StepExecutor = this.stepExecutorRegistry.getExecutor(step.type);
    if (!executor) {
      this.errorHandler.handleError(new Error(`Can't find step executor with type=${step.type}`));
      return tap();
    }
    return switchMap((scope: Scope) => {
      // do not start with executor.execute
      // it could fail outside catch error
      return of(null).pipe(
        switchMap(() => executor.execute(scope, step, workflow)),
        pipeFromArray(this.getOutputProcessOperators(workflow, step, scope))
      );
    });
  }

  private getOutputProcessOperators(workflow: Workflow, step: WorkflowStep, scope) {
    const resultOperators = [
      map((data: any) => {
        this.workflowLogger.logStepExecution(workflow, step);
        return { data, error: null };
      }),
      catchError(error => {
        this.workflowLogger.logStepError(workflow, step, error);
        return of({ data: null, error: error });
      }),
      map(result => {
        const newScope = this.scopeService.getGlobalScope();
        newScope.set(Scope.RESULT, result);
        newScope.set(Scope.PARAM, undefined);
        return newScope;
      })
    ];

    const executeActionOperators = [
      map((nextScope: any) => {
        this.workflowLogger.logStepExecution(workflow, step);
        return nextScope;
      })
    ];

    const regularOperators = [
      catchError(error => {
        if (error instanceof StepExecutionError) {
          throw error;
        } else {
          this.workflowLogger.logStepError(workflow, step, error);
          throw new StepExecutionError(error);
        }
      })
    ];

    const onlyRegularOperators = [
      map(() => {
        this.workflowLogger.logStepExecution(workflow, step);
        return this.getNonResultActionOutput(scope);
      })
    ];

    const conditionOperators = [
      mergeMap(conditionResult => {
        this.workflowLogger.logStepExecution(workflow, step);

        const stepsParam = step.params.find(param => param.type === ConditionParameterType.STEPS);
        const getConditionSteps = (stepsParam.value as { condition: boolean; steps: WorkflowStep[] }[]).find(
          value => value.condition === !!conditionResult
        );

        if (!getConditionSteps) {
          throw new Error('There is no suitable steps by condition.');
        }
        return of(this.getNonResultActionOutput(scope)).pipe(
          pipeFromArray(this.makeExecutionArrayFromSteps(workflow, getConditionSteps.steps))
        );
      })
    ];

    if (
      step.type === StepType.HTTP_REQUEST ||
      step.type === StepType.CUSTOM_CODE ||
      step.type === StepType.CUSTOM_ASYNC_CODE
    ) {
      return [...resultOperators, ...regularOperators];
    } else if (step.type === StepType.CONDITION) {
      return [...conditionOperators, ...regularOperators];
    } else if (step.type === StepType.EXECUTE_ACTION) {
      return [...executeActionOperators, ...regularOperators];
    } else {
      return [...onlyRegularOperators, ...regularOperators];
    }
  }

  private getNonResultActionOutput(scope: Scope) {
    const newScope = this.scopeService.getGlobalScope();
    if (scope.values[Scope.RESULT]) {
      newScope.set(Scope.RESULT, scope.values[Scope.RESULT]);
    } else {
      newScope.set(Scope.PARAM, scope.values[Scope.PARAM]);
    }
    return newScope;
  }
}
