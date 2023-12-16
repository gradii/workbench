import { Inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AnalyticsService } from '@common';
import { NB_WINDOW } from '@nebular/theme';

import { fromLesson } from '@tools-state/tutorial-lesson/lesson.reducer';
import { Lesson } from '@tools-state/tutorial-brief/tutorial-brief.model';
import {
  getActiveLessonIndex,
  getOverallProgress,
  getTrackableLessons
} from '@tools-state/tutorial-lesson/lesson.selectors';
import { LessonActions } from '@tools-state/tutorial-lesson/lesson.actions';
import { TutorialProgress } from '@shared/tutorial/tutorial-data.service';
import { TutorialFacade } from '@tools-state/tutorial/tutorial.facade';

enum EXPERIMENT_OPTIONS {
  NO_FIRST_SECTION = 'No First Section',
  FULL_TUTORIAL = 'Full Tutorial',
}

@Injectable({ providedIn: 'root' })
export class LessonFacade {
  readonly lessons$: Observable<Lesson[]> = this.store.pipe(select(getTrackableLessons));

  readonly activeLessonIndex$: Observable<number> = this.store.pipe(select(getActiveLessonIndex));

  readonly progress$: Observable<number> = this.store.pipe(select(getOverallProgress));

  constructor(
    private store: Store<fromLesson.State>,
    @Inject(NB_WINDOW) private window,
    private tutorialFacade: TutorialFacade,
    private analytics: AnalyticsService
  ) {
  }

  execute(lessons: Lesson[], tutorialProgress: TutorialProgress): void {
    // super simple AB test
    const modifiedLessons = this.modifyPerABTest(lessons);

    this.store.dispatch(LessonActions.setLessons({ lessons: modifiedLessons }));
    this.store.dispatch(LessonActions.executeAll({ tutorialProgress }));
  }

  skip(): void {
    this.tutorialFacade.getActiveLessonInfo().subscribe(([lessonStep, lessonName]) => {
      this.analytics.logSkipLesson(lessonName, lessonStep);
      this.store.dispatch(LessonActions.skip());
    });
  }

  private modifyPerABTest(lessons: Lesson[]): Lesson[] {
    const experimentName = 'Tutorial Sections';
    const experimentOption = this.getExperimentOption(experimentName);
    this.analytics.logExperiment(experimentName, experimentOption);

    if (experimentOption === EXPERIMENT_OPTIONS.NO_FIRST_SECTION) {
      // remove first section
      lessons.shift();
    }

    return lessons;
  }

  private getExperimentOption(name: string): EXPERIMENT_OPTIONS {
    const experimentOptions = [EXPERIMENT_OPTIONS.FULL_TUTORIAL, EXPERIMENT_OPTIONS.NO_FIRST_SECTION];
    const storageKey = `BAKERY_AB_TEST_${name}`;
    const localStorage = this.window.localStorage;

    const storedOption = localStorage.getItem(storageKey);

    if (storedOption && experimentOptions.includes(storedOption)) {
      return storedOption;
    }

    const newOption = experimentOptions[Math.floor(Math.random() * experimentOptions.length)];
    localStorage.setItem(storageKey, newOption);
    return newOption;
  }
}
