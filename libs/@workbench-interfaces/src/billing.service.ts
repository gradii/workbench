import { ElementRef } from '@angular/core';


export interface Card {
  source: string;
  id: string;
  brand: string;
  last4: string;
  expirationMonth: number;
  expirationYear: number;
  couponId?: string;
}

export interface CardElements {
  number: ElementRef;
  expiry: ElementRef;
  cvc: ElementRef;
}
