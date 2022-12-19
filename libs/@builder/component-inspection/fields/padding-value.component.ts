import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ComponentFacade } from '@tools-state/component/component-facade.service';

import { PaddingUnit, PaddingValue } from '@common/public-api';
import { InputWithUnit } from './spacing-input-with-unit.component';
import { PopoverDirective } from '@gradii/triangle/popover';

@Component({
  selector: 'ub-padding-field',
  templateUrl: './padding-value.component.html',
  styleUrls: ['./spacing-input-with-unit.component.scss', './padding-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaddingValueComponent extends InputWithUnit<PaddingValue, PaddingUnit>
  implements OnChanges, AfterViewInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly activeComponent$ = this.componentFacade.activeComponent$;

  protected minValue = 0;

  readonly singleStep = 1;
  readonly doubleStep = 8;
  readonly tripleStep = 16;

  unitOptions = [
    { label: 'px', value: 'px' },
    { label: '%', value: '%' }
  ];

  @Input() value: PaddingValue;
  @Input() unit: PaddingUnit;

  @Output() valueChange = new EventEmitter<PaddingValue>();
  @Output() unitChange = new EventEmitter<PaddingUnit>();

  @ViewChild('input') inputElementRef: ElementRef<HTMLInputElement>;
  @ViewChild(PopoverDirective) popoverDirective: PopoverDirective;
  @ViewChild(PopoverDirective, { read: ElementRef }) popoverElementRef: ElementRef<HTMLInputElement>;

  @HostListener('click', ['$event'])
  onClick(event) {
    if (this.shouldFocusInput(event)) {
      this.focusInput();
    }
  }

  constructor(private componentFacade: ComponentFacade) {
    super();
  }

  ngOnChanges({ value }: SimpleChanges) {
    if (value != null) {
      this.inputValueLength = value.currentValue.toString().length;
    }
  }

  ngAfterViewInit() {
    this.activeComponent$.pipe(takeUntil(this.destroy$)).subscribe(() => this.popoverDirective.hide());
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  addToValue(toAdd: number) {
    this.emitUpdateIfValid(this.value + toAdd);
  }

  onUnitChange(unit: string) {
    this.popoverDirective.hide();
    super.onUnitChange(unit as PaddingUnit);
    this.focusInput();
  }

  parseValue(possibleValue: string): PaddingValue | null {
    const number = parseInt(possibleValue, 10);

    if (isNaN(number) || number < this.minValue || number > this.maxValue) {
      return null;
    }

    return number;
  }

  protected shouldFocusInput(event: Event): boolean {
    return event.target !== this.popoverElementRef.nativeElement;
  }

  protected focusInput() {
    if (this.inputElementRef) {
      this.inputElementRef.nativeElement.focus();
    }
  }
}
