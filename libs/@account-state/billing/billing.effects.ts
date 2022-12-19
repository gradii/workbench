import { BillingInfo } from '@account-state/billing/billing-info.model';
import { BillingActions } from '@account-state/billing/billing.actions';
import { Payment } from '@account-state/billing/payment.model';
import { Injectable } from '@angular/core';
import { createEffect, ofType } from '@ngneat/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { BillingService } from './billing.service';

@Injectable()
export class BillingEffects {
  loadBillingInfo$ = createEffect((actions) =>
    actions.pipe(
      ofType(BillingActions.LoadBillingInfo),
      mergeMap(() =>
        this.billingService.billingInfo().pipe(
          map((billingInfo: BillingInfo) => BillingActions.LoadBillingInfoSuccess(billingInfo)),
          catchError(() => of(BillingActions.LoadBillingInfoFailed()))
        )
      )
    )
  );

  updatePaymentMethod$ = createEffect((actions) =>
    actions.pipe(
      ofType(BillingActions.UpdatePaymentMethod),
      mergeMap(({ card }) =>
        this.billingService.updatePaymentMethod(card).pipe(
          map((billingInfo: BillingInfo) => BillingActions.UpdatePaymentMethodSuccess(billingInfo)),
          catchError(() => of(BillingActions.UpdatePaymentMethodFailed()))
        )
      )
    )
  );

  deletePaymentMethod$ = createEffect((actions) =>
    actions.pipe(
      ofType(BillingActions.DeletePaymentMethod),
      mergeMap(() =>
        this.billingService.deletePaymentMethod().pipe(
          map((billingInfo: BillingInfo) => BillingActions.DeletePaymentMethodSuccess(billingInfo)),
          catchError(() => of(BillingActions.DeletePaymentMethodFailed()))
        )
      )
    )
  );

  loadPaymentHistory$ = createEffect((actions) =>
    actions.pipe(
      ofType(BillingActions.LoadPaymentHistory),
      mergeMap(() =>
        this.billingService.loadPaymentHistory().pipe(
          map((paymentHistory: Payment[]) => BillingActions.LoadPaymentHistorySuccess(paymentHistory)),
          catchError(() => of(BillingActions.LoadPaymentHistoryFailed()))
        )
      )
    )
  );

  constructor(private billingService: BillingService) {
  }
}
