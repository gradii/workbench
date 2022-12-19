import { Inject, Injectable } from '@angular/core';

import { StepExecutor } from './step-executor.model';
import { STEP_EXECUTOR } from './workflow.utils';

@Injectable()
export class StepExecutorRegistry {
  private registryMap: Map<string, StepExecutor> = new Map<string, StepExecutor>();

  constructor(@Inject(STEP_EXECUTOR) executors: StepExecutor[]) {
    executors.forEach((executor: StepExecutor) => this.registryMap.set(executor.type, executor));
  }

  getExecutor(type: string) {
    return this.registryMap.get(type);
  }
}
