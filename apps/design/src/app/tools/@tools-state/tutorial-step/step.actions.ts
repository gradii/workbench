import { createAction, props } from '@ngrx/store';

import { Step } from '@tools-state/tutorial-brief/tutorial-brief.model';

export namespace StepActions {
  export enum ActionTypes {
    SetSteps = '[Step] Set Steps',
    SetActiveStep = '[Step] Set Active Step',
    MoveStep = '[Step] Move Step',
  }

  export const setSteps = createAction(ActionTypes.SetSteps, props<{ steps: Step[] }>());
  export const setActiveStep = createAction(ActionTypes.SetActiveStep, props<{ activeStepIndex: number }>());
  export const moveStep = createAction(ActionTypes.MoveStep, props<{ distance: number }>());
}
