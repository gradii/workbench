import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ub-add-new-action-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./add-new-action-button.component.scss'],
  template: `
    <button class="add-new-action-button" triButton size="tiny" (click)="click.emit()">
      <tri-icon svgIcon="outline:plus"></tri-icon>
    </button>
  `
})
export class AddNewActionButtonComponent {
  @Output() click = new EventEmitter();
}
