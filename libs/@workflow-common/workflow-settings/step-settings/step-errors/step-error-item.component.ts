import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WorkflowLogExtended } from '@common/public-api';

@Component({
  selector: 'ub-step-error-item',
  styleUrls: ['./step-error-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tri-icon class="alert" svgIcon="outline:alert"></tri-icon>
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
