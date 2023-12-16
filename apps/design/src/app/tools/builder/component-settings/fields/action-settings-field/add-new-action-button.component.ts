import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ub-add-new-action-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./add-new-action-button.component.scss'],
  template: `
    <button class="add-new-action-button" nbButton ghost size="tiny" (click)="click.emit()">
      <span>Add New Action</span>
      <bc-icon name="plus"></bc-icon>
    </button>
  `
})
export class AddNewActionButtonComponent {
  @Output() click = new EventEmitter();
}
