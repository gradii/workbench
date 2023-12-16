import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({ name: 'amount', pure: true })
export class AmountPipe implements PipeTransform {
  private currency = new CurrencyPipe(this.locale);

  constructor(@Inject(LOCALE_ID) private locale: string) {
  }

  transform(value: number): string {
    return this.currency.transform(value / 100);
  }
}
