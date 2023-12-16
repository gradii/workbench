import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Lesson } from '@tools-state/tutorial-brief/tutorial-brief.model';
import { LessonFacade } from '@tools-state/tutorial-lesson/lesson.facade';

@Component({
  selector: 'ub-tour-progress-container',
  template: `
    <ub-tour-progress
      [lessons]="lessons$ | async"
      [activeLessonIndex]="activeLessonIndex$ | async"
      [progress]="progress$ | async"
      (skip)="skip()"
    >
    </ub-tour-progress>
  `
})
export class TourProgressContainerComponent {
  readonly lessons$: Observable<Lesson[]> = this.lessonFacade.lessons$;
  readonly activeLessonIndex$: Observable<number> = this.lessonFacade.activeLessonIndex$;
  readonly progress$: Observable<number> = this.lessonFacade.progress$;

  constructor(private lessonFacade: LessonFacade) {
  }

  skip(): void {
    this.lessonFacade.skip();
  }
}
