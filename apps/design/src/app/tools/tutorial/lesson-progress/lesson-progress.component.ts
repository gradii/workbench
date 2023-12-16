import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ub-lesson-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./lesson-progress.component.scss'],
  template: `
    <svg height="24" width="24">
      <circle class="circle" r="11" cx="12" cy="12"></circle>
      <circle
        [style.stroke-dasharray]="circumference"
        [style.stroke-dashoffset]="offset"
        class="circle progress-bar"
        r="11"
        cx="12"
        cy="12"
      ></circle>
    </svg>
    {{ currentStepIndex + 1 }} of {{ stepsNumber }}
  `
})
export class LessonProgressComponent {
  @Input() stepsNumber = 0;
  @Input() currentStepIndex = 0;

  get circumference(): number {
    const radius = 11;
    return radius * 2 * Math.PI;
  }

  get offset(): number {
    const percent = (this.currentStepIndex * 100) / this.stepsNumber;
    return this.circumference - (percent / 100) * this.circumference;
  }
}
