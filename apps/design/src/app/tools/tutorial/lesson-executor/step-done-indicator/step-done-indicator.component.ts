import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'ub-step-done-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./step-done-indicator.component.scss'],
  template: `
    <svg class="checkmark">
      <circle class="checkmark__circle" cx="20" cy="20" r="19" fill="none"></circle>
      <path class="checkmark__check" fill="none" d="M13 21l5 5 9-11"></path>
    </svg>
  `
})
export class StepDoneIndicatorComponent {
  @Input()
  @HostBinding('class.visible')
  visible = false;
}
