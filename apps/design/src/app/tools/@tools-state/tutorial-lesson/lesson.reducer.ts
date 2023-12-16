import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Lesson } from '../tutorial-brief/tutorial-brief.model';
import { LessonProgress } from '../../tutorial/lesson-executor/lesson-executor';
import { LessonActions } from '@tools-state/tutorial-lesson/lesson.actions';

export namespace fromLesson {
  export interface State extends EntityState<Lesson> {
    activeLessonIndex: number;
    activeLessonProgress: LessonProgress;
    dynamicLessonSkipped: boolean;
  }

  const adapter: EntityAdapter<Lesson> = createEntityAdapter<Lesson>({
    selectId: (lesson: Lesson) => lesson.id
  });

  const initialState: State = adapter.getInitialState({
    activeLessonIndex: 0,
    activeLessonProgress: { done: false, currentStep: 0 },
    dynamicLessonSkipped: false
  });

  export const reducer = createReducer(
    initialState,
    on(LessonActions.setLessons, (state: State, { lessons }) => {
      return adapter.setAll(lessons, state);
    }),
    on(LessonActions.setActiveLessonIndex, (state: State, { activeLessonIndex }) => {
      return { ...state, activeLessonIndex };
    }),
    on(LessonActions.setActiveLessonProgress, (state: State, { activeLessonProgress }) => {
      return { ...state, activeLessonProgress };
    }),
    on(LessonActions.skip, (state: State) => {
      const activeId = state.ids[state.activeLessonIndex];
      const activeLesson = state.entities[activeId];
      if (activeLesson.type === 'dynamic') {
        return { ...state, dynamicLessonSkipped: true };
      }
      return state;
    })
  );

  export const { selectAll } = adapter.getSelectors();
}
