import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AnalyticsService } from '@common';

import { fromTutorial } from '@tools-state/tutorial/tutorial.reducer';
import { TutorialAction } from '@tools-state/tutorial/tutorial.actions';
import { getActiveLesson, getDynamicLessonSkipped } from '@tools-state/tutorial-lesson/lesson.selectors';
import { Lesson } from '@tools-state/tutorial-brief/tutorial-brief.model';
import { getActiveStepIndex } from '@tools-state/tutorial-step/step.selectors';

@Injectable({ providedIn: 'root' })
export class TutorialFacade {
  constructor(private store: Store<fromTutorial.State>, private analytics: AnalyticsService) {
  }

  initialize(tutorialId: string): void {
    this.store.dispatch(TutorialAction.initialize({ tutorialId }));
  }

  start(tutorialProgressId: string): void {
    this.store.dispatch(TutorialAction.start({ tutorialProgressId }));
  }

  finish(): void {
    this.store.dispatch(TutorialAction.finish());
  }

  getActiveLessonInfo(): Observable<[number, string]> {
    const stepIndex$ = this.store.pipe(select(getActiveStepIndex));
    const lesson$ = this.store.pipe(select(getActiveLesson));

    return combineLatest([stepIndex$, lesson$]).pipe(
      take(1),
      map(([stepIndex, lesson]: [number, Lesson]) => [stepIndex, lesson.title])
    );
  }

  logFinishTutorial(): void {
    this.store.pipe(select(getDynamicLessonSkipped), take(1)).subscribe(dynamicLessonSkipped => {
      if (!dynamicLessonSkipped) {
        this.analytics.logFinishTutorial();
      }
    });
  }
}
