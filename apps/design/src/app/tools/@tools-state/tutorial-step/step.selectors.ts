import { createSelector } from '@ngrx/store';

import { getToolsState } from '@tools-state/tools.selector';
import { fromTools } from '@tools-state/tools.reducer';
import { fromStep } from '@tools-state/tutorial-step/step.reducer';
import { Step } from '@tools-state/tutorial-brief/tutorial-brief.model';

export const getStepState = createSelector(getToolsState, (state: fromTools.State) => state.step);
export const getSteps = createSelector(getStepState, fromStep.selectAll);
export const getTrackableStepsNumber = createSelector(getSteps, (steps: Step[]) => steps.length);

export const getActiveStepIndex = createSelector(getStepState, (state: fromStep.State) => state.activeStepIndex);
export const getActiveStep = createSelector(
  getActiveStepIndex,
  getSteps,
  (activeStepIndex: number, steps: Step[]) => steps[activeStepIndex]
);
export const getActiveStepId = createSelector(getActiveStep, (step: Step) => step.id);
