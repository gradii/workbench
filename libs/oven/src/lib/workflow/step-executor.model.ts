import { Scope } from '@common';

export interface StepExecutor {
  type
  execute(scope: Scope, step, workflow)
}
