import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges,
  OnDestroy, Output, Renderer2, SimpleChanges, ViewChild
} from '@angular/core';

import { MarginUnit, MarginValue } from '@common/public-api';
import { PopoverDirective } from '@gradii/triangle/popover';

import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InputWithUnit } from './spacing-input-with-unit.component';

@Component({
  selector: 'ub-margin-field',
  templateUrl: './margin-value.component.html',
  styleUrls: ['./spacing-input-with-unit.component.scss', './margin-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarginValueComponent extends InputWithUnit<MarginValue, MarginUnit>
  implements OnChanges, AfterViewInit, OnDestroy {
  private readonly hiddenInputClassName = 'input-hidden';
  private readonly destroy$ = new Subject<void>();
  private readonly activeComponent$ = this.componentFacade.activeComponent$;

  readonly singleStep = 1;
  readonly doubleStep = 8;
  readonly tripleStep = 16;

  unitsOrAuto = [
    { label: 'px', value: 'px' },
    { label: '%', value: '%' },
    { label: 'auto', value: 'auto' }
  ];

  @Input() value: MarginValue;
  @Input() unit: MarginUnit;

  @Output() valueChange = new EventEmitter<MarginValue>();
  @Output() unitChange = new EventEmitter<MarginUnit>();

  @ViewChild('input') inputElementRef: ElementRef<HTMLInputElement>;
  @ViewChild(PopoverDirective) popoverDirective: PopoverDirective;
  @ViewChild(PopoverDirective, { read: ElementRef }) popoverElementRef: ElementRef<HTMLInputElement>;

  @HostListener('click', ['$event'])
  onClick(event) {
    if (this.shouldFocusInput(event)) {
      this.focusInput();
    }
  }

  constructor(private renderer: Renderer2, private componentFacade: ComponentFacade) {
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
    // casting to number is safe as this method called for input events and input
    // shown only if value is numeric
    this.emitUpdateIfValid((this.value as number) + toAdd);
  }

  onUnitChange(unitOrAuto: string) {
    this.popoverDirective.hide();

    if (unitOrAuto === 'auto') {
      this.valueChange.emit('auto');
    } else {
      const unit = unitOrAuto as MarginUnit;
      super.onUnitChange(unit);
      this.focusInput();
    }
  }

  parseValue(possibleValue: string): MarginValue | null {
    if (possibleValue === 'auto') {
      return 'auto';
    }

    const number = parseInt(possibleValue, 10);
    if (isNaN(number) || number < this.minValue || number > this.maxValue) {
      return null;
    }

    return number;
  }

  isValueEditable(): boolean {
    return this.value !== 'auto';
  }

  getInputClasses(): string[] {
    const classes = [super.getInputWidthClass()];

    if (!this.isValueEditable()) {
      classes.push(this.hiddenInputClassName);
    }

    return classes;
  }

  protected shouldFocusInput(event: Event): boolean {
    return this.value !== 'auto' && event.target !== this.popoverElementRef.nativeElement;
  }

  protected focusInput() {
    if (this.inputElementRef) {
      const inputEl = this.inputElementRef.nativeElement;
      this.renderer.removeClass(inputEl, this.hiddenInputClassName);
      inputEl.focus();
    }
  }
}
