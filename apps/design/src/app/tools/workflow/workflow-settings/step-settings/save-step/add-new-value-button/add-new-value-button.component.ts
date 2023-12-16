import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ub-add-new-value-button',
  styleUrls: ['./add-new-value-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="add-new-value-button" nbButton ghost size="tiny" (click)="click.emit()">
      Add New Variable
      <bc-icon name="plus"></bc-icon>
    </button>
  `
})
export class AddNewValueButtonComponent {
  @Output() click = new EventEmitter();
}
