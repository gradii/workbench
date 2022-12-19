import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ComponentSize } from '@common/public-api';

import { Dimension } from './size-input.component';

@Component({
  selector: 'ub-size-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./field.scss', './size-settings-field.component.scss'],
  template: `
    <pf-size-input
      *ngIf="!withoutWidth"
      name="Width"
      [withAuto]="withAuto"
      [dimension]="width"
      [max]="widthMax"
      [inputDisabled]="value.widthAuto"
      [disabled]="widthDisabled"
      [unitList]="widthUnitList"
      [style.margin-right]="withoutHeight ? '0' : '1rem'"
      (dimensionChange)="updateWidth($event)"
    >
    </pf-size-input>

    <pf-size-input
      *ngIf="!withoutHeight"
      name="Height"
      [withAuto]="withAuto"
      [dimension]="height"
      [max]="heightMax"
      [inputDisabled]="value.heightAuto"
      [unitList]="heightUnitList"
      (dimensionChange)="updateHeight($event)"
    >
    </pf-size-input>
  `
})
export class SizeSettingsFieldComponent {
  @HostBinding('class') elementClass = 'row-field';

  @Input() withAuto: boolean;
  @Input() withoutWidth: boolean;
  @Input() withoutHeight: boolean;
  @Input() widthUnitList = [
    { label: 'px', value: 'px' },
    { label: '%', value: '%' }
  ];
  @Input() heightUnitList = [
    { label: 'px', value: 'px' },
    { label: '%', value: '%' }
  ];
  @Input() widthDisabled = false;

  @Input() value: ComponentSize;
  @Output() valueChange: EventEmitter<ComponentSize> = new EventEmitter<ComponentSize>();

  get heightMax(): number {
    return this.value.heightUnit === '%' ? 100 : 9999;
  }

  get widthMax(): number {
    if (this.value.widthUnit === '%') {
      return 100;
    }

    if ((this.value.widthUnit as any) === 'col') {
      return 12;
    }

    return Number.POSITIVE_INFINITY;
  }

  get height(): Dimension {
    return { value: this.value.heightValue, unit: this.value.heightUnit, auto: this.value.heightAuto };
  }

  get width(): Dimension {
    return { value: this.value.widthValue, unit: this.value.widthUnit, auto: this.value.widthAuto };
  }

  updateWidth(dimension: Partial<Dimension>): void {
    const { value, unit, auto } = dimension;
    this.updateSize({ widthValue: value, widthUnit: unit, widthAuto: auto });
  }

  updateHeight(dimension: Partial<Dimension>): void {
    const { value, unit, auto } = dimension;
    this.updateSize({ heightValue: value, heightUnit: unit, heightAuto: auto });
  }

  updateSize(size: Partial<ComponentSize>) {
    this.valueChange.emit({ ...this.value, ...size });
  }
}
