import { ChangeDetectionStrategy, Component } from '@angular/core';

import { StaticStepSwitchActivationService } from './static-step-switch-activation.service';
import { StepSwitchActivation } from '../../step-swith/step-switch-activation';

@Component({
  selector: 'ub-static-lesson',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: StepSwitchActivation, useClass: StaticStepSwitchActivationService }],
  styleUrls: ['./static-lesson.component.scss'],
  template: ` <ub-lesson-controller></ub-lesson-controller> `
})
export class StaticLessonComponent {
}
