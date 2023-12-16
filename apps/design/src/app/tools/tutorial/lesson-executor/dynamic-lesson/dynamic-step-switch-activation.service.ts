import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StepSwitchActivation } from '../../step-swith/step-switch-activation';
import { Step } from '@tools-state/tutorial-brief/tutorial-brief.model';
import { StepFacade } from '@tools-state/tutorial-step/step.facade';

@Injectable()
export class DynamicStepSwitchActivationService extends StepSwitchActivation {
  withPrev$: Observable<boolean> = combineLatest([this.stepFacade.step$, this.stepFacade.currentStepIndex$]).pipe(
    map(([step, index]: [Step, number]) => {
      return index !== 0 && step.showPrevButton;
    })
  );
  private completedSteps: Set<string> = new Set<string>();
  withNext$: Observable<boolean> = this.stepFacade.step$.pipe(
    map((step: Step) => !step.validity || this.completedSteps.has(step.id))
  );

  constructor(private stepFacade: StepFacade) {
    super();
  }

  markStepCompleted(id: string): void {
    this.completedSteps.add(id);
  }
}
