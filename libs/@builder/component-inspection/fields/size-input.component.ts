import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

export interface Dimension {
  value: number;
  unit: 'px' | '%';
  auto: boolean;
}

@Component({
  selector: 'pf-size-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./size-input.component.scss'],
  template: `
    <pf-setting-label-container [notificationDisabled]="disabled">
      <label *ngIf="name" class="size-label" [class.disabled]="disabled" for="sizeField">{{ name }}</label>
    </pf-setting-label-container>
    <bc-input-unit
      [unitList]="unitList"
      [showUnit]="!dimension.auto"
      [selectedUnit]="dimension.unit"
      [unitDisabled]="inputDisabled || disabled"
      (unitChange)="updateUnit($event)"
    >
      <tri-input-number
        type="number"
        id="sizeField"
        fullWidth
        min="0"
        #input
        size="small"
        [max]="max"
        [disabled]="inputDisabled || disabled"
        [placeholder]="placeholder"
        [ngModel]="displayValue"
        (ngModelChange)="updateValue($event)"
      ></tri-input-number>
    </bc-input-unit>
    <tri-checkbox *ngIf="withAuto" [checked]="dimension.auto" (checkedChange)="setAuto($event)"
                  [disabled]="disabled">
      <span class="size-label" [class.disabled]="disabled">auto</span>
    </tri-checkbox>
  `
})
export class SizeInputComponent {
  @Input() name: string;
  @Input() dimension: Dimension;

  @Input() max: number;
  @Input() withAuto: boolean;
  @Input() disabled: boolean;
  @Input() inputDisabled: boolean;
  @Input() unitList;

  @Output() dimensionChange = new EventEmitter<Partial<Dimension>>();

  @ViewChild('input') inputElementElementRef: ElementRef<HTMLInputElement>;

  get placeholder(): string {
    return this.dimension.auto ? 'auto' : '';
  }

  get displayValue(): number {
    return this.dimension.auto ? null : this.dimension.value;
  }

  setAuto(auto: boolean) {
    this.dimensionChange.emit({ ...this.dimension, auto });
  }

  updateUnit(unit: string) {
    const valueInRange: number = this.putValueInValidRange(this.dimension.value, unit as 'px' | '%');
    this.dimensionChange.emit({
      ...this.dimension,
      unit: unit as 'px' | '%',
      value: valueInRange
    });
  }

  updateValue(value: number) {
    const valueInRange: number = this.putValueInValidRange(value, this.dimension.unit);
    this.dimensionChange.emit({ ...this.dimension, value: valueInRange });
  }

  private putValueInValidRange(value: number, unit: 'px' | '%'): number {
    value = Math.max(value, 0);

    if (unit === '%') {
      value = this.putValueInPercentRange(value);
    }

    if ((unit as any) === 'col') {
      value = this.putValueInColumnsRange(value);
    }

    // if (this.inputElementElementRef) {
    //   this.inputElementElementRef.nativeElement.value = value.toString();
    // }

    return value;
  }

  private putValueInPercentRange(value: number): number {
    const MAX_SIZE_IN_PERCENT = 100;

    value = Math.min(value, MAX_SIZE_IN_PERCENT);

    return value;
  }

  private putValueInColumnsRange(value: number): number {
    const MAX_SIZE_IN_COLUMNS = 12;

    value = Math.min(value, MAX_SIZE_IN_COLUMNS);
    value = Math.round(value);

    return value;
  }
}
