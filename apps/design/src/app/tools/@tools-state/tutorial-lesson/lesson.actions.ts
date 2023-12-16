import { createAction, props } from '@ngrx/store';

import { Lesson } from '@tools-state/tutorial-brief/tutorial-brief.model';
import { TutorialProgress } from '@shared/tutorial/tutorial-data.service';

export namespace LessonActions {
  export enum ActionTypes {
    SetLessons = '[Lesson] Set Lessons',
    SetActiveLessonIndex = '[Lesson] Set Active Lesson Index',
    SetActiveLessonProgress = '[Lesson] Set Active Lesson Progress',
    ExecuteAll = '[Lesson] Execute All',
    SetupExecution = '[Lesson] Setup Execution',
    Execute = '[Lesson] Execute',
    Skip = '[Lesson] Skip',
  }

  export const setLessons = createAction(ActionTypes.SetLessons, props<{ lessons: Lesson[] }>());
  export const setActiveLessonIndex = createAction(
    ActionTypes.SetActiveLessonIndex,
    props<{ activeLessonIndex: number }>()
  );
  export const setActiveLessonProgress = createAction(
    ActionTypes.SetActiveLessonProgress,
    props<{ activeLessonProgress }>()
  );
  export const executeAll = createAction(ActionTypes.ExecuteAll, props<{ tutorialProgress: TutorialProgress }>());
  export const setupExecution = createAction(
    ActionTypes.SetupExecution,
    props<{ tutorialProgress: TutorialProgress }>()
  );
  export const execute = createAction(ActionTypes.Execute);
  export const skip = createAction(ActionTypes.Skip);
}
