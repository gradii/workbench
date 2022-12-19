import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ub-radius-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./field.scss'],
  template: `
    <pf-setting-label-container>
      <label class="settings-field-label" for="radiusField">Radius</label>
    </pf-setting-label-container>
    <bc-input-unit [unitList]="unitList" [selectedUnit]="radius.unit" (unitChange)="updateUnit($event)">
      <tri-input-number
        id="radiusField"
        fullWidth
        min="0"
        placeholder="radius"
        [ngModel]="radius.value"
        (ngModelChange)="updateValue($event)"
      ></tri-input-number>
    </bc-input-unit>
  `
})
export class RadiusSettingsFieldComponent {
  @Input() radius: { value: number; unit: 'px' | 'rem' };

  @Output() radiusChange: EventEmitter<{ value: number; unit: 'px' | 'rem' }> = new EventEmitter<{
    value: number;
    unit: 'px' | 'rem';
  }>();

  unitList = [
    { label: 'px', value: 'px' },
    { label: '%', value: '%' },
    { label: 'rem', value: 'rem' }
  ];

  updateValue(value: number) {
    this.radiusChange.emit({ value, unit: this.radius.unit });
  }

  updateUnit(unit: string) {
    this.radiusChange.emit({ value: this.radius.value, unit: unit as 'px' | 'rem' });
  }
}
