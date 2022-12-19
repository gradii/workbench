import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector       : 'ub-add-new-value-button',
  styleUrls      : ['./add-new-value-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <button class="add-new-value-button" 
            triButton ghost size="xsmall" (click)="click.emit()">
      Add New Variable
      <tri-icon svgIcon="outline:plus"></tri-icon>
    </button>
  `
})
export class AddNewValueButtonComponent {
  @Output() click = new EventEmitter();
}
