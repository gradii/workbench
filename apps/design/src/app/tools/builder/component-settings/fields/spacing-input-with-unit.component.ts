import { ElementRef, EventEmitter } from '@angular/core';

export abstract class InputWithUnit<V, U> {
  protected minValue = -9999;
  protected maxValue = 9999;

  inputValueLength: number;

  abstract value: V;
  abstract unit: U;

  abstract valueChange = new EventEmitter<V>();
  abstract unitChange = new EventEmitter<U>();

  abstract inputElementRef: ElementRef<HTMLInputElement>;

  abstract parseValue(possibleValue: string | V): V | null;

  onValueChange(inputValue: string) {
    this.inputValueLength = inputValue.length;
    const valueToSet = inputValue === '' ? '0' : inputValue;
    this.emitUpdateIfValid(valueToSet);
  }

  onUnitChange(unit: U) {
    this.unitChange.emit(unit);
  }

  resetToLatestValueIfInvalid() {
    const isValueInvalid = this.parseValue(this.inputElementRef.nativeElement.value) === null;

    if (isValueInvalid) {
      const value = this.value.toString();
      this.inputValueLength = value.length;
      this.inputElementRef.nativeElement.value = value;
      this.inputElementRef.nativeElement.className = this.getInputWidthClass();
    }
  }

  getInputWidthClass(): string {
    if (this.inputValueLength <= 3) {
      return `length-${this.inputValueLength}`;
    }

    return 'length-4-plus';
  }

  protected emitUpdateIfValid(possibleValue: string | V) {
    const parsedValue = this.parseValue(possibleValue);
    if (parsedValue !== null) {
      return this.valueChange.emit(parsedValue);
    }
  }
}
