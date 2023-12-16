import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

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

@Injectable()
export class StripeProvider implements OnDestroy {
  private error = new Subject<string>();
  readonly error$: Observable<string> = this.error.asObservable();

  private brand = new Subject<string>();
  readonly brand$: Observable<string> = this.brand.asObservable();

  private stripe: stripe.Stripe = Stripe(environment.stripeKey);

  private cardNumber: stripe.elements.Element;
  private cardExpiry: stripe.elements.Element;
  private cardCvc: stripe.elements.Element;
  private elements: stripe.elements.Elements = this.stripe.elements();

  ngOnDestroy(): void {
    // StripeProvider can be used just to handle 3D secure
    // in that case we haven't got card created
    if (this.cardNumber) {
      this.cardNumber.destroy();
    }
  }

  mount(cardElements: CardElements) {
    this.createCardNumberElement(cardElements.number);
    this.createCardExpiryElement(cardElements.expiry);
    this.createCardCvcElement(cardElements.cvc);
  }

  createCard(): Observable<Card> {
    return from(this.stripe.createToken(this.cardNumber)).pipe(
      map((res: stripe.TokenResponse) => this.parseCreateTokenResponse(res))
    );
  }

  handleCardPayment(paymentIntentClientSecret: string): Observable<stripe.PaymentIntentResponse> {
    return from(this.stripe.confirmCardPayment(paymentIntentClientSecret));
  }

  focusCardNumber() {
    this.cardNumber.on('ready', () => this.cardNumber.focus());
  }

  private createCardNumberElement(elementRef: ElementRef) {
    this.cardNumber = this.elements.create('cardNumber');
    this.cardNumber.mount(elementRef.nativeElement);
    this.cardNumber.on('change', ({ brand }) => {
      // Since stripe has incosistency we need to fix that abbreviation
      if (brand === 'amex') {
        brand = 'American Express';
      }

      this.brand.next(brand);
    });
    this.listenForErrors(this.cardNumber);
  }

  private createCardExpiryElement(elementRef: ElementRef) {
    this.cardExpiry = this.elements.create('cardExpiry');
    this.cardExpiry.mount(elementRef.nativeElement);
    this.listenForErrors(this.cardExpiry);
  }

  private createCardCvcElement(elementRef: ElementRef) {
    this.cardCvc = this.elements.create('cardCvc');
    this.cardCvc.mount(elementRef.nativeElement);
    this.listenForErrors(this.cardCvc);
  }

  private listenForErrors(el: stripe.elements.Element) {
    el.on('change', res => this.elementChange(res));
  }

  private elementChange(res: stripe.elements.ElementChangeResponse) {
    const { error } = res;

    if (error) {
      this.error.next(error.message);
    } else {
      this.error.next();
    }
  }

  private parseCreateTokenResponse(res: stripe.TokenResponse): Card {
    const { token, error } = res;

    if (error) {
      this.error.next(error.message);
      throw error;
    } else {
      return this.parseToken(token);
    }
  }

  private parseToken(token: stripe.Token): Card {
    const { card } = token;
    return {
      source: token.id,
      id: card.id,
      brand: card.brand,
      last4: card.last4,
      expirationMonth: card.exp_month,
      expirationYear: card.exp_year
    };
  }
}
