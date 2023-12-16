import { createSelector } from '@ngrx/store';

import { getToolsState } from '../tools.selector';
import { fromTools } from '../tools.reducer';
import { fromLesson } from './lesson.reducer';
import { Lesson } from '../tutorial-brief/tutorial-brief.model';
import { LessonProgress } from '../../tutorial/lesson-executor/lesson-executor';

export const getLessonState = createSelector(getToolsState, (state: fromTools.State) => state.lesson);
export const getLessons = createSelector(getLessonState, fromLesson.selectAll);

export const getTrackableLessons = createSelector(getLessons, (lessons: Lesson[]) =>
  lessons.filter((lesson: Lesson) => lesson.trackInTourProgress)
);

export const getActiveLessonIndex = createSelector(
  getLessonState,
  (state: fromLesson.State) => state.activeLessonIndex
);

export const getActiveLesson = createSelector(
  getLessons,
  getActiveLessonIndex,
  (lessons: Lesson[], activeLessonIndex: number) => lessons[activeLessonIndex]
);

export const getActiveLessonProgress = createSelector(
  getLessonState,
  (state: fromLesson.State) => state.activeLessonProgress
);

export const getOverallProgress = createSelector(
  getLessons,
  getActiveLesson,
  getActiveLessonProgress,
  (lessons: Lesson[], activeLesson: Lesson, activeLessonProgress: LessonProgress) => {
    const activeIndex = lessons.findIndex((lesson: Lesson) => lesson === activeLesson);
    const completedLessons: Lesson[] = lessons.slice(0, activeIndex);
    const completedLessonsStepsNumber = completedLessons.reduce((sum, { steps }) => sum + steps.length, 0);
    const allLessonsStepsNumber = lessons.reduce((sum, { steps }) => sum + steps.length, 0);
    const overallProgress =
      ((completedLessonsStepsNumber + activeLessonProgress.currentStep) * 100) / allLessonsStepsNumber;
    return Math.round(overallProgress);
  }
);

export const getDynamicLessonSkipped = createSelector(
  getLessonState,
  (state: fromLesson.State) => state.dynamicLessonSkipped
);
