import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'ub-position-group-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./field.scss', './position-group-settings-field.component.scss'],
  template: `
    <button
      *ngFor="let option of options"
      nbButton
      [ngClass]="{ active: option.value === value }"
      class="clear-icon direction"
      size="tiny"
      (click)="update(option.value)"
    >
      <bc-icon [name]="option.icon"></bc-icon>
    </button>
  `
})
export class PositionGroupSettingsFieldComponent {
  @HostBinding('class') elementClass = 'row-field no-top-margin';

  @Input() value: boolean;
  @Input() options: { icon: string; value: string }[];
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  update(value) {
    this.valueChange.emit(value);
  }
}
