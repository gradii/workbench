import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormFieldWidth, FormFieldWidthType } from '@common';

@Component({
  selector: 'ub-form-field-width-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./field.scss', './form-field-width-settings-field.component.scss'],
  template: `
    <ub-setting-label-container [showNotification]="showStyleNotification">
      <label class="settings-field-label">Width</label>
    </ub-setting-label-container>
    <div class="input-container">
      <nb-select
        [selected]="value.type"
        (selectedChange)="updateValue({ type: $event })"
        ubSelectRegister
        class="bakery-dropdown"
        shape="rectangle"
      >
        <nb-option *ngFor="let option of typeOptions" [value]="option.value">{{ option.label }}</nb-option>
      </nb-select>
      <bc-input-unit
        [unitList]="unitOptions"
        [selectedUnit]="value.customUnit"
        [class.disabled]="value.type !== 'custom'"
        [unitDisabled]="value.type !== 'custom'"
        (unitChange)="updateUnit($event)"
      >
        <input
          type="number"
          id="sizeField"
          nbInput
          fullWidth
          min="0"
          [max]="max"
          [disabled]="value.type !== 'custom'"
          [ngModel]="value.customValue"
          (ngModelChange)="updateValue({ customValue: $event })"
        />
      </bc-input-unit>
    </div>
  `
})
export class FormFieldWidthSettingsFieldComponent {
  @Input() value: FormFieldWidth;
  @Input() typeOptions = [
    { label: 'Auto', value: FormFieldWidthType.AUTO },
    { label: 'Full width', value: FormFieldWidthType.FULL },
    { label: 'Custom', value: FormFieldWidthType.CUSTOM }
  ];
  @Input() showStyleNotification = true;

  @Output() valueChange: EventEmitter<FormFieldWidth> = new EventEmitter<FormFieldWidth>();

  get max(): number {
    return this.value.customUnit === '%' ? 100 : 9999;
  }

  unitOptions = [
    { label: 'px', value: 'px' },
    { label: '%', value: '%' },
    { label: 'rem', value: 'rem' }
  ];

  updateValue(width: Partial<FormFieldWidth>) {
    if (width.customUnit === '%') {
      width.customValue = this.putValueInRange(this.value.customValue);
    }
    if (width.customValue && this.value.customUnit === '%') {
      width.customValue = this.putValueInRange(width.customValue);
    }
    this.valueChange.emit({ ...this.value, ...width });
  }

  updateUnit(unit: string) {
    this.updateValue({ customUnit: unit as 'px' | '%' | 'rem' });
  }

  private putValueInRange(value: number): number {
    value = Math.min(value, 100);
    value = Math.max(value, 0);
    return value;
  }
}
