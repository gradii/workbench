import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { Action, select, Store } from '@ngrx/store';
import { onlyLatestFrom } from '@common';

import { LessonActions } from '@tools-state/tutorial-lesson/lesson.actions';
import { TutorialDataService, TutorialProgress } from '@shared/tutorial/tutorial-data.service';
import { LessonExecutorRegistryService } from '../../tutorial/lesson-executor/lesson-executor-registry.service';
import { LessonExecutor, LessonProgress } from '../../tutorial/lesson-executor/lesson-executor';
import { fromLesson } from '@tools-state/tutorial-lesson/lesson.reducer';
import { getActiveLesson, getActiveLessonIndex } from '@tools-state/tutorial-lesson/lesson.selectors';
import { Lesson } from '@tools-state/tutorial-brief/tutorial-brief.model';
import { getTutorialProgress } from '@tools-state/tutorial/tutorial.selectors';
import { TutorialsModule } from '../../tutorial/tutorials.module';
import { StepFacade } from '@tools-state/tutorial-step/step.facade';
import { StepActions } from '@tools-state/tutorial-step/step.actions';

@Injectable({ providedIn: TutorialsModule })
export class LessonExecutorProvider {
  private executor: LessonExecutor;

  setLessonExecutor(executor: LessonExecutor): void {
    this.executor = executor;
  }

  getLessonExecutor(): LessonExecutor {
    return this.executor;
  }
}

@Injectable()
export class LessonEffects {
  executeAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LessonActions.ActionTypes.ExecuteAll),
      mergeMap(({ tutorialProgress }: { tutorialProgress: TutorialProgress }) => [
        LessonActions.setActiveLessonIndex({ activeLessonIndex: tutorialProgress.lesson || 0 }),
        LessonActions.setupExecution({ tutorialProgress })
      ])
    )
  );

  setupLessonExecution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LessonActions.ActionTypes.SetupExecution),
      withLatestFrom(this.store.pipe(select(getActiveLesson))),
      mergeMap(([{ tutorialProgress }, lesson]: [{ tutorialProgress: TutorialProgress }, Lesson]) => [
        StepActions.setSteps({ steps: lesson.steps }),
        StepActions.setActiveStep({ activeStepIndex: tutorialProgress.step || 0 }),
        LessonActions.execute()
      ])
    )
  );

  executeLesson$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LessonActions.ActionTypes.Execute),
        onlyLatestFrom(this.store.pipe(select(getActiveLesson))),
        tap((lesson: Lesson) => {
          const executor: LessonExecutor = this.lessonExecutorRegistry.getLessonExecutor(lesson.type);
          this.lessonExecutorProvider.setLessonExecutor(executor);
          executor.startLesson();
        })
      ),
    { dispatch: false }
  );

  updateTutorialProgress$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LessonActions.ActionTypes.SetActiveLessonProgress),
        withLatestFrom(this.store.pipe(select(getActiveLessonIndex))),
        withLatestFrom(this.store.pipe(select(getTutorialProgress))),
        mergeMap(
          ([[{ activeLessonProgress }, activeLessonIndex], tutorialProgress]: [
            [{ activeLessonProgress: LessonProgress }, number],
            TutorialProgress,
          ]) => {
            return this.tutorialsDataService.updateTutorialProgress(tutorialProgress.id, {
              lesson: activeLessonIndex,
              step: activeLessonProgress.currentStep,
              complete: false
            });
          }
        )
      ),
    { dispatch: false }
  );

  finishLesson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LessonActions.ActionTypes.SetActiveLessonProgress),
      filter(({ activeLessonProgress }: { activeLessonProgress: LessonProgress }) => activeLessonProgress.done),
      tap(() => {
        const executor = this.lessonExecutorProvider.getLessonExecutor();
        executor.forceComplete();
      }),
      onlyLatestFrom(this.store.pipe(select(getActiveLessonIndex))),
      withLatestFrom(this.store.pipe(select(getTutorialProgress))),
      mergeMap(([activeLessonIndex, tutorialProgress]) => {
        return this.createNextLessonActions(activeLessonIndex, tutorialProgress);
      })
    )
  );

  skip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LessonActions.ActionTypes.Skip),
      tap(() => {
        const executor = this.lessonExecutorProvider.getLessonExecutor();
        executor.forceComplete();
      }),
      onlyLatestFrom(this.store.pipe(select(getActiveLessonIndex))),
      withLatestFrom(this.store.pipe(select(getTutorialProgress))),
      mergeMap(([activeLessonIndex, tutorialProgress]) => {
        return this.createNextLessonActions(activeLessonIndex, tutorialProgress);
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromLesson.State>,
    private stepFacade: StepFacade,
    private lessonExecutorRegistry: LessonExecutorRegistryService,
    private tutorialsDataService: TutorialDataService,
    private lessonExecutorProvider: LessonExecutorProvider
  ) {
  }

  private createNextLessonActions(activeLessonIndex: number, tutorialProgress: TutorialProgress): Action[] {
    const initialActions = [
      LessonActions.setActiveLessonIndex({ activeLessonIndex: activeLessonIndex + 1 }),
      StepActions.setActiveStep({ activeStepIndex: 0 }),
      LessonActions.setupExecution({
        tutorialProgress: {
          ...tutorialProgress,
          lesson: activeLessonIndex + 1,
          step: 0
        }
      })
    ];

    return initialActions;
  }
}
