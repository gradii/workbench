import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Theme } from '@common';

@Component({
  selector: 'ub-radius-settings',
  styleUrls: ['./radius-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="preview-container">
      <div [style.borderRadius]="styleValue" class="preview"></div>
    </div>

    <div class="input-container">
      <label class="label" for="radiusInput">
        Round corners
      </label>
      <bc-input-unit
        [unitList]="unitList"
        [selectedUnit]="unit"
        [unitDisabled]="!extendedSettingsAvailable"
        (unitChange)="updateUnit($event)"
      >
        <input
          id="radiusInput"
          nbInput
          [ngModel]="radius"
          [disabled]="!extendedSettingsAvailable"
          (ngModelChange)="radiusChange.emit({ value: $event, unit: unit })"
        />
      </bc-input-unit>
    </div>
  `
})
export class RadiusSettingsComponent {
  @Input() radius: number;
  @Input() unit: string;
  @Input() extendedSettingsAvailable: boolean;
  @Input() theme: Theme;

  @Output() radiusChange: EventEmitter<{ value: number; unit: string }> = new EventEmitter<{
    value: number;
    unit: string;
  }>();

  unitList = [
    { label: 'px', value: 'px' },
    { label: 'rem', value: 'rem' }
  ];

  get styleValue(): string {
    return this.radius + this.unit;
  }

  private baseRem = 16;

  updateUnit(unit: string) {
    let value: number;
    if (this.unit === 'px' && unit === 'rem') {
      value = this.convertPxToRem(this.radius);
    }
    if (this.unit === 'rem' && unit === 'px') {
      value = this.convertRemToPx(this.radius);
    }
    this.radiusChange.emit({ value, unit });
  }

  private convertRemToPx(rem) {
    return Math.round(+rem * this.baseRem);
  }

  private convertPxToRem(px) {
    return +px / this.baseRem;
  }
}
