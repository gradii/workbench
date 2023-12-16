import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { delay, mapTo } from 'rxjs/operators';

import { DynamicStepValidatorService } from '../dynamic-step-validator/dynamic-step-validator.service';
import { StateComparator } from '../dynamic-step-validator/state-comparator.service';
import { DynamicStepSwitchActivationService } from './dynamic-step-switch-activation.service';
import { StepSwitchActivation } from '../../step-swith/step-switch-activation';

@Component({
  selector: 'ub-dynamic-lesson',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DynamicStepValidatorService,
    StateComparator,
    DynamicStepSwitchActivationService,
    { provide: StepSwitchActivation, useExisting: DynamicStepSwitchActivationService }
  ],
  styleUrls: ['./dynamic-lesson.component.scss'],
  template: `
    <div class="lesson-container" #lessonContainer [class.pointer-event-auto]="pointerEventsAuto$ | async">
      <div
        class="lesson"
        cdkDrag
        [cdkDragBoundary]="lessonContainer"
        (cdkDragStarted)="pointerEventsAuto$.next(true)"
        (cdkDragReleased)="pointerEventsAuto$.next(false)"
      >
        <div class="handle">
          <bc-icon name="drag-handle"></bc-icon>
        </div>

        <ub-lesson-controller></ub-lesson-controller>

        <ub-step-done-indicator [visible]="visible$ | async"></ub-step-done-indicator>
      </div>
    </div>
  `
})
export class DynamicLessonComponent implements OnInit {
  readonly pointerEventsAuto$ = new Subject<boolean>();

  private showStepCompleted$ = this.dynamicStepValidator.stepCompleted$.pipe(mapTo(true));
  private hideStepCompleted$ = this.showStepCompleted$.pipe(mapTo(false), delay(1500));
  readonly visible$ = merge(this.showStepCompleted$, this.hideStepCompleted$);

  constructor(private dynamicStepValidator: DynamicStepValidatorService) {
  }

  ngOnInit(): void {
    this.dynamicStepValidator.installValidator();
  }
}
