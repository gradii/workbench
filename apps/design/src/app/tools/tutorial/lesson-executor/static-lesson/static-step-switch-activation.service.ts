import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { StepSwitchActivation } from '../../step-swith/step-switch-activation';
import { Step } from '@tools-state/tutorial-brief/tutorial-brief.model';
import { StepFacade } from '@tools-state/tutorial-step/step.facade';

@Injectable()
export class StaticStepSwitchActivationService extends StepSwitchActivation {
  withNext$: Observable<boolean> = of(true);

  withPrev$: Observable<boolean> = combineLatest([this.stepFacade.step$, this.stepFacade.currentStepIndex$]).pipe(
    map(([step, index]: [Step, number]) => {
      return index !== 0 && step.showPrevButton;
    })
  );

  constructor(private stepFacade: StepFacade) {
    super();
  }
}
