import { InjectionToken } from '@angular/core';

export const STEP_EXECUTOR = new InjectionToken('Step Executor');

export class StepExecutionError extends Error {
  constructor(error: Error) {
    super(error.message);
  }
}
