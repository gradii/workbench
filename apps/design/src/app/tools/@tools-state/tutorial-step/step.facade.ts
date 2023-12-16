import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

import { fromStep } from '@tools-state/tutorial-step/step.reducer';
import { Step } from '@tools-state/tutorial-brief/tutorial-brief.model';
import {
  getActiveStep,
  getActiveStepId,
  getActiveStepIndex,
  getTrackableStepsNumber
} from '@tools-state/tutorial-step/step.selectors';
import { StepActions } from '@tools-state/tutorial-step/step.actions';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StepFacade {
  readonly stepsNumber$: Observable<number> = this.store.pipe(select(getTrackableStepsNumber));

  readonly currentStepIndex$: Observable<number> = this.store.pipe(select(getActiveStepIndex));

  readonly step$: Observable<Step> = this.store.pipe(select(getActiveStep));

  readonly stepId$: Observable<string> = this.store.pipe(select(getActiveStepId));

  readonly stepUrl$: Observable<SafeUrl> = this.stepId$.pipe(
    map((stepId: string) => {
      const url = environment.tutorialsPrefix + stepId;
      return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    })
  );

  // Required for analytics purpose. To calculate spent time for the step
  private prevNextCallTime: Date = new Date();

  constructor(private store: Store<fromStep.State>, private domSanitizer: DomSanitizer) {
  }

  next(): void {
    this.moveStep(1);
    this.prevNextCallTime = new Date();
  }

  prev(): void {
    this.moveStep(-1);
  }

  getPrevNextCallTime(): Date {
    return this.prevNextCallTime;
  }

  private moveStep(distance: number): void {
    if (distance) {
      this.store.dispatch(StepActions.moveStep({ distance }));
    }
  }
}
