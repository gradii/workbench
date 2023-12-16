import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Step } from '@tools-state/tutorial-brief/tutorial-brief.model';
import { StepFacade } from '@tools-state/tutorial-step/step.facade';

@Component({
  selector: 'ub-lesson-progress-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ub-lesson-progress
      *ngIf="showProgress$ | async"
      [stepsNumber]="stepsNumber$ | async"
      [currentStepIndex]="currentStepIndex$ | async"
    >
    </ub-lesson-progress>
  `
})
export class LessonProgressContainerComponent {
  readonly stepsNumber$: Observable<number> = this.stepFacade.stepsNumber$;
  readonly currentStepIndex$: Observable<number> = this.stepFacade.currentStepIndex$;
  readonly showProgress$: Observable<boolean> = this.stepFacade.step$.pipe(map((step: Step) => step.showProgress));

  constructor(private stepFacade: StepFacade) {
  }
}
