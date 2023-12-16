import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WorkflowLogExtended } from '@common';

@Component({
  selector: 'ub-step-error-item',
  styleUrls: ['./step-error-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-icon class="alert" icon="alert-circle"></nb-icon>
    <span class="message">{{ error.message }}</span>
  `
})
export class StepErrorItemComponent {
  @Input() error: WorkflowLogExtended;

  opened: boolean;

  toggle() {
    this.opened = !this.opened;
  }
}
