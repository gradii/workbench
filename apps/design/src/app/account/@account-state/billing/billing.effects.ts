import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { BillingService } from './billing.service';
import { BillingActions } from '@account-state/billing/billing.actions';
import { BillingInfo } from '@account-state/billing/billing-info.model';
import { Payment } from '@account-state/billing/payment.model';

@Injectable()
export class BillingEffects {
  loadBillingInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BillingActions.ActionTypes.LoadBillingInfo),
      mergeMap(() =>
        this.billingService.billingInfo().pipe(
          map((billingInfo: BillingInfo) => BillingActions.loadBillingInfoSuccess({ billingInfo })),
          catchError(() => of(BillingActions.loadBillingInfoFailed()))
        )
      )
    )
  );

  updatePaymentMethod$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BillingActions.ActionTypes.UpdatePaymentMethod),
      mergeMap(({ card }) =>
        this.billingService.updatePaymentMethod(card).pipe(
          map((billingInfo: BillingInfo) => BillingActions.updatePaymentMethodSuccess({ billingInfo })),
          catchError(() => of(BillingActions.updatePaymentMethodFailed()))
        )
      )
    )
  );

  deletePaymentMethod$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BillingActions.ActionTypes.DeletePaymentMethod),
      mergeMap(() =>
        this.billingService.deletePaymentMethod().pipe(
          map((billingInfo: BillingInfo) => BillingActions.deletePaymentMethodSuccess({ billingInfo })),
          catchError(() => of(BillingActions.deletePaymentMethodFailed()))
        )
      )
    )
  );

  loadPaymentHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BillingActions.ActionTypes.LoadPaymentHistory),
      mergeMap(() =>
        this.billingService.loadPaymentHistory().pipe(
          map((paymentHistory: Payment[]) => BillingActions.loadPaymentHistorySuccess({ paymentHistory })),
          catchError(() => of(BillingActions.loadPaymentHistoryFailed()))
        )
      )
    )
  );

  constructor(private actions$: Actions, private billingService: BillingService) {
  }
}
