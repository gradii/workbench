import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';

import { fromStep } from '@tools-state/tutorial-step/step.reducer';
import { StepActions } from '@tools-state/tutorial-step/step.actions';
import { getActiveStepIndex, getTrackableStepsNumber } from '@tools-state/tutorial-step/step.selectors';
import { LessonProgress } from '../../tutorial/lesson-executor/lesson-executor';
import { LessonActions } from '@tools-state/tutorial-lesson/lesson.actions';

@Injectable()
export class StepEffects {
  moveStep$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StepActions.ActionTypes.MoveStep),
      withLatestFrom(this.store.pipe(select(getActiveStepIndex))),
      withLatestFrom(this.store.pipe(select(getTrackableStepsNumber))),
      map(([[{ distance }, activeStepIndex], stepsNumber]: [[{ distance: number }, number], number]) => {
        return this.handleMoveStep(distance, activeStepIndex, stepsNumber);
      })
    )
  );

  updateTutorialProgress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StepActions.ActionTypes.SetActiveStep),
      withLatestFrom(this.store.pipe(select(getTrackableStepsNumber))),
      map(([{ activeStepIndex }, stepsNumber]) => {
        const activeLessonProgress = this.calcProgress(activeStepIndex, stepsNumber);
        return LessonActions.setActiveLessonProgress({ activeLessonProgress });
      })
    )
  );

  constructor(private actions$: Actions, private store: Store<fromStep.State>) {
  }

  private calcProgress(activeStepIndex: number, stepsNumber: number): LessonProgress {
    if (!stepsNumber) {
      return { done: false, currentStep: 0 };
    }

    return { done: false, currentStep: activeStepIndex };
  }

  private handleMoveStep(distance: number, activeStepIndex: number, stepsNumber: number): Action {
    const newIndex = activeStepIndex + distance;

    if (newIndex >= stepsNumber) {
      return LessonActions.setActiveLessonProgress({ activeLessonProgress: { done: true, currentStep: stepsNumber } });
    }

    if (newIndex < 0) {
      return StepActions.setActiveStep({ activeStepIndex });
    }

    return StepActions.setActiveStep({ activeStepIndex: newIndex });
  }
}
