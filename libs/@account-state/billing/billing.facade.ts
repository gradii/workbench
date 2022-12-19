import { BillingInfo } from '@account-state/billing/billing-info.model';
import { BillingActions } from '@account-state/billing/billing.actions';
import {
  selectBillingInfo, selectChangePlanLoading, selectDeletePaymentMethodFailed, selectDeletePaymentMethodLoading,
  selectDeletePaymentMethodSuccess, selectHadBilling, selectHasPaymentMethod, selectLoadBillingInfo,
  selectLoadBillingInfoFailed, selectPaymentHistory, selectPaymentHistoryLoading, selectSubscriptionExpiryDate,
  selectUpdatePaymentMethodFailed, selectUpdatePaymentMethodLoading, selectWillBeCancelled
} from '@account-state/billing/billing.selectors';
import { ChangePlanHandler, ChangePlanService } from '@account-state/billing/change-plan.service';
import { Payment } from '@account-state/billing/payment.model';
import { Injectable } from '@angular/core';
import { UserFacade } from '@auth/user-facade.service';
import { dispatch } from '@ngneat/effects';
import { Card } from '@workbench-interfaces';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { selectUpdatePaymentMethodSuccess } from './billing.selectors';
import { getPlanName, Plan } from './billing.service';

@Injectable()
export class BillingFacade {
  loadBillingInfo$: Observable<boolean> = selectLoadBillingInfo
  loadBillingInfoFailed$: Observable<boolean> = selectLoadBillingInfoFailed

  updatePaymentMethodLoading$: Observable<boolean> = selectUpdatePaymentMethodLoading;
  updatePaymentMethodFailed$: Observable<boolean> = selectUpdatePaymentMethodFailed;
  updatePaymentMethodSuccess$: Observable<boolean> = selectUpdatePaymentMethodSuccess;

  deletePaymentMethodLoading$: Observable<boolean> = selectDeletePaymentMethodLoading;
  deletePaymentMethodFailed$: Observable<boolean> = selectDeletePaymentMethodFailed;
  deletePaymentMethodSuccess$: Observable<boolean> = selectDeletePaymentMethodSuccess;

  paymentHistory$: Observable<Payment[]> = selectPaymentHistory;
  paymentHistoryLoading$: Observable<boolean> = selectPaymentHistoryLoading;

  changePlanLoading$: Observable<boolean> = selectChangePlanLoading;

  billingInfo$: Observable<BillingInfo> = selectBillingInfo;
  hasPaymentMethod$: Observable<boolean> = selectHasPaymentMethod;
  hadBilling$: Observable<boolean> = selectHadBilling;
  willBeCancelled$: Observable<boolean> = selectWillBeCancelled;
  subscriptionExpiryDate$: Observable<Date> = selectSubscriptionExpiryDate;

  activePlanName$: Observable<string> = this.userFacade.plan$.pipe(map((plan: Plan) => getPlanName(plan)));

  constructor(
    private changePlanService: ChangePlanService,
    private userFacade: UserFacade
  ) {
  }

  load(): void {
    dispatch(BillingActions.LoadBillingInfo());
  }

  // updatePaymentMethod(card: Card): void {
  //   dispatch(BillingActions.updatePaymentMethod({ card }));
  // }

  deletePaymentMethod(): void {
    dispatch(BillingActions.DeletePaymentMethod());
  }

  startPaymentProcess(): void {
    dispatch(BillingActions.ChangePlanLoading(true));
  }

  hideLoader(): void {
    dispatch(BillingActions.ChangePlanLoading(false ));
  }

  changePlan(handler: ChangePlanHandler, plan: Plan, card?: Card, couponId?: string, reason?: string): void {
    dispatch(BillingActions.ChangePlanLoading(true ));
    this.changePlanService
      .changePlan(handler, plan, card, couponId, reason)
      .subscribe(() => dispatch(BillingActions.ChangePlanLoading(false)));
  }

  retryChangePlan(handler: ChangePlanHandler, plan: Plan, card: Card, pendingInvoice: string, couponId?: string): void {
    dispatch(BillingActions.ChangePlanLoading(true));
    this.changePlanService
      .retryChangePlan(handler, plan, card, pendingInvoice, couponId)
      .subscribe(() => dispatch(BillingActions.RetryChangePlanLoading(false)));
  }

  clearUpdatePaymentMethodFailed(): void {
    dispatch(BillingActions.ClearUpdatePaymentMethodFailed());
  }

  loadPaymentHistory(): void {
    dispatch(BillingActions.LoadPaymentHistory());
  }

  verifyInvoicePayed(paymentIntentId: string): Observable<void> {
    return this.changePlanService.verifyInvoicePayed(paymentIntentId).pipe(
      tap(() => {
        dispatch(BillingActions.ChangePlanLoading(false));
        dispatch(BillingActions.ChangePlanSuccess());
      }),
      catchError(() => {
        dispatch(BillingActions.ChangePlanFailed());
        return of(null);
      })
    );
  }
}
