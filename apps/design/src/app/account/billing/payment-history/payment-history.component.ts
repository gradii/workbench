import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { BillingFacade } from '@account-state/billing/billing.facade';
import { Payment } from '@account-state/billing/payment.model';

@Component({
  selector: 'ub-payment-history',
  styleUrls: ['./payment-history.component.scss'],
  templateUrl: './payment-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentHistoryComponent implements OnInit {
  paymentHistoryLoading$: Observable<boolean> = this.billingFacade.paymentHistoryLoading$;

  paymentHistory$: Observable<Payment[]> = this.billingFacade.paymentHistory$;

  constructor(private billingFacade: BillingFacade) {
  }

  ngOnInit(): void {
    this.billingFacade.loadPaymentHistory();
  }
}
