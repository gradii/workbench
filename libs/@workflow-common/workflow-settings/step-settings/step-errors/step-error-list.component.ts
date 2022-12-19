import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WorkflowLogExtended } from '@common/public-api';

@Component({
  selector: 'ub-step-error-list',
  styleUrls: ['./step-error-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="errors.length" class="title">
      <span>Latest execution errors</span>
      <button triButton ghost size="xsmall" color="basic" (click)="clearAll()">
        Clear
      </button>
    </div>

    <ub-step-error-item *ngFor="let error of errors" [error]="error"></ub-step-error-item>
  `
})
export class StepErrorListComponent {
  @Input() errors: WorkflowLogExtended[] = [];

  clearAll() {
    this.errors = [];
  }
}
