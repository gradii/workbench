import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IconSize } from '@common/public-api';

@Component({
  selector       : 'ub-icon-size-settings-field-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./field.scss', './icon-size-settings-field.component.scss'],
  template       : `
    <pf-setting-label-container>
      <label class="settings-field-label">Size</label>
    </pf-setting-label-container>
    <div class="field-container">
      <tri-select
        [value]="sizeSelectedOption"
        (change)="updateSelectedSize($event)"
        fullWidth
        class="bakery-dropdown"
        shape="rectangle"
      >
        <tri-option *ngFor="let option of sizeOptions" [value]="option.value">{{ option.label }}</tri-option>
      </tri-select>
      <bc-input-unit
        [unitList]="unitList"
        [selectedUnit]="size.customUnit"
        [class.disabled]="!size.custom"
        [unitDisabled]="!size.custom"
        (unitChange)="updateCustomUnit($event)"
      >
        <tri-input-number
          id="sizeField"
          fullWidth
          min="0"
          [disabled]="!size.custom"
          [ngModel]="size.customValue"
          (ngModelChange)="updateCustomValue($event)"
        ></tri-input-number>
      </bc-input-unit>
    </div>
  `
})
export class IconSizeSettingsFieldComponent {
  @Input() size: IconSize;
  @Output() sizeChange: EventEmitter<IconSize> = new EventEmitter<IconSize>();

  unitList = [
    { label: 'px', value: 'px' },
    { label: 'rem', value: 'rem' }
  ];

  sizeOptions = [
    { label: 'tiny', value: 'tiny' },
    { label: 'small', value: 'small' },
    { label: 'medium', value: '' },
    { label: 'large', value: 'large' },
    { label: 'giant', value: 'giant' },
    { label: 'custom', value: 'custom' }
  ];

  get sizeSelectedOption(): string {
    if (this.size.custom) {
      return 'custom';
    }
    return this.size.predefinedValue;
  }

  updateSelectedSize(value: string) {
    const custom = value === 'custom';
    this.sizeChange.emit({
      ...this.size,
      custom,
      predefinedValue: custom ? this.size.predefinedValue : (value as any)
    });
  }

  updateCustomUnit(customUnit: string) {
    if (customUnit === this.size.customUnit) {
      return;
    }
    const baseRemSize = 16;
    const customValue =
            customUnit === 'px'
              ? Math.round(this.size.customValue * baseRemSize)
              : Number((this.size.customValue / baseRemSize).toFixed(2));
    this.sizeChange.emit({
      ...this.size,
      customUnit: customUnit as 'px' | 'rem',
      customValue
    });
  }

  updateCustomValue(customValue: number) {
    this.sizeChange.emit({
      ...this.size,
      customValue
    });
  }
}
