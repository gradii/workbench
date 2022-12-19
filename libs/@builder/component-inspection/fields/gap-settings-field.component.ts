import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ComponentGap } from '@common/public-api';

import { Dimension } from './size-input.component';

@Component({
  selector: 'pf-gap-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./field.scss', './gap-settings-field.component.scss'],
  template: `
    <pf-size-input
      *ngIf="!withoutWidth"
      name="Row Gap"
      [withAuto]="false"
      [dimension]="rowGap"
      [disabled]="gapDisabled"
      [unitList]="rowGapUnitList"
      (dimensionChange)="updateRowGap($event)"
    >
    </pf-size-input>

    <div class="gap-lock" (click)="onToggleLock()">
      <tri-icon svgIcon="outline:lock" *ngIf="gapLock"></tri-icon>  
      <tri-icon svgIcon="outline:unlock" *ngIf="!gapLock"></tri-icon>  
    </div>
    
    <pf-size-input
      *ngIf="!withoutHeight"
      name="Column Gap"
      [withAuto]="false"
      [dimension]="columnGap"
      [disabled]="gapDisabled"
      [unitList]="columnGapUnitList"
      (dimensionChange)="updateColumnGap($event)"
    >
    </pf-size-input>
  `
})
export class GapSettingsFieldComponent {
  @HostBinding('class') elementClass = 'row-field';

  @Input() withAuto: boolean;
  @Input() withoutWidth: boolean;
  @Input() withoutHeight: boolean;
  @Input() rowGapUnitList = [
    { label: 'px', value: 'px' },
    { label: '%', value: '%' }
  ];
  @Input() columnGapUnitList = [
    { label: 'px', value: 'px' },
    { label: '%', value: '%' }
  ];
  @Input() gapDisabled = false;

  @Input() value: ComponentGap;
  @Output() valueChange: EventEmitter<ComponentGap> = new EventEmitter<ComponentGap>();

  get columnGap(): Dimension {
    return { value: this.value.columnGapValue, unit: this.value.columnGapUnit, auto: false };
  }

  get rowGap(): Dimension {
    return { value: this.value.rowGapValue, unit: this.value.rowGapUnit, auto: false };
  }

  get gapLock(): boolean {
    return this.value.gapLock;
  }

  updateRowGap(dimension: Partial<Dimension>): void {
    const { value, unit } = dimension;
    this.updateSize({ rowGapValue: value, rowGapUnit: unit });
  }

  updateColumnGap(dimension: Partial<Dimension>): void {
    const { value, unit } = dimension;
    this.updateSize({ columnGapValue: value, columnGapUnit: unit });
  }

  updateSize(size: Partial<ComponentGap>) {
    this.valueChange.emit({ ...this.value, ...size });
  }

  onToggleLock() {
    this.updateSize({ gapLock: !this.value.gapLock });
  }
}
