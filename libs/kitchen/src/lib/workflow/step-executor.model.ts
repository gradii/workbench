import { Scope } from '@common/public-api';

export interface StepExecutor {
  type
  execute(scope: Scope, step, workflow)
}
