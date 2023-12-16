import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ub-number-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./field.scss'],
  template: `
    <label class="settings-field-label">{{ label }}</label>
    <input
      type="number"
      nbInput
      fullWidth
      [min]="min"
      [max]="max"
      [formControl]="control"
      (ngModelChange)="onChange($event)"
    />
  `
})
export class NumberSettingsFieldComponent {
  @HostBinding('class.row-field')
  get isRow(): boolean {
    return this.direction === 'row';
  }

  @HostBinding('class.column-field')
  get isColumn(): boolean {
    return this.direction === 'column';
  }

  @Input() set value(value: number) {
    this.control.setValue(value, { emitViewToModelChange: false });
  }

  @Input() min = 0;
  @Input() max = 100;
  @Input() trim = true;
  @Input() label = 'Value';
  @Input() direction: 'row' | 'column' = 'row';

  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  control = new FormControl();

  onChange(value: number) {
    if (this.trim) {
      value = Math.max(Math.min(value, this.max), this.min);
      this.control.setValue(value, { emitViewToModelChange: false });
    }
    this.valueChange.emit(value);
  }
}
