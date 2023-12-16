import { AfterViewInit, Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { Card, StripeProvider } from '../services/stripe-provider.service';

@Component({
  selector: 'ub-card',
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',
  providers: [StripeProvider]
})
export class CardComponent implements AfterViewInit {
  @Output() card: EventEmitter<Card> = new EventEmitter();

  @ViewChild('cardNumber', { static: true }) cardNumber: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiry: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvc: ElementRef;

  @Output() error$: Observable<string> = this.stripe.error$;
  brand$: Observable<string> = this.stripe.brand$;

  constructor(private stripe: StripeProvider, private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.mountStripe();
    this.stripe.focusCardNumber();

    const cardElements = [this.cardNumber.nativeElement, this.cardExpiry.nativeElement, this.cardCvc.nativeElement];
    for (const cardElement of cardElements) {
      this.renderer.setAttribute(cardElement, 'nbInput', '');
    }
  }

  submit(): void {
    this.stripe.createCard().subscribe((card: Card) => this.card.next(card));
  }

  recollectPaymentMethod(): void {
    this.mountStripe();
  }

  handleCardPayment(paymentIntentClientSecret: string): Observable<stripe.PaymentIntentResponse> {
    return this.stripe.handleCardPayment(paymentIntentClientSecret);
  }

  private mountStripe() {
    this.stripe.mount({
      number: this.cardNumber,
      expiry: this.cardExpiry,
      cvc: this.cardCvc
    });
  }
}
