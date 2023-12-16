import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { fromBilling } from '@account-state/billing/billing.reducer';
import { BillingActions } from '@account-state/billing/billing.actions';
import {
  selectBillingInfo,
  selectChangePlanLoading,
  selectDeletePaymentMethodFailed,
  selectDeletePaymentMethodLoading,
  selectDeletePaymentMethodSuccess,
  selectHadBilling,
  selectHasPaymentMethod,
  selectLoadBillingInfo,
  selectLoadBillingInfoFailed,
  selectPaymentHistory,
  selectPaymentHistoryLoading,
  selectSubscriptionExpiryDate,
  selectUpdatePaymentMethodFailed,
  selectUpdatePaymentMethodLoading,
  selectWillBeCancelled
} from '@account-state/billing/billing.selectors';
import { getPlanName, Plan } from './billing.service';
import { selectUpdatePaymentMethodSuccess } from './billing.selectors';
import { Card } from '../../billing/services/stripe-provider.service';
import { BillingInfo } from '@account-state/billing/billing-info.model';
import { Payment } from '@account-state/billing/payment.model';
import { ChangePlanHandler, ChangePlanService } from '@account-state/billing/change-plan.service';
import { UserFacade } from '@auth/user-facade.service';

@Injectable()
export class BillingFacade {
  loadBillingInfo$: Observable<boolean> = this.store.pipe(select(selectLoadBillingInfo));
  loadBillingInfoFailed$: Observable<boolean> = this.store.pipe(select(selectLoadBillingInfoFailed));

  updatePaymentMethodLoading$: Observable<boolean> = this.store.pipe(select(selectUpdatePaymentMethodLoading));
  updatePaymentMethodFailed$: Observable<boolean> = this.store.pipe(select(selectUpdatePaymentMethodFailed));
  updatePaymentMethodSuccess$: Observable<boolean> = this.store.pipe(select(selectUpdatePaymentMethodSuccess));

  deletePaymentMethodLoading$: Observable<boolean> = this.store.pipe(select(selectDeletePaymentMethodLoading));
  deletePaymentMethodFailed$: Observable<boolean> = this.store.pipe(select(selectDeletePaymentMethodFailed));
  deletePaymentMethodSuccess$: Observable<boolean> = this.store.pipe(select(selectDeletePaymentMethodSuccess));

  paymentHistory$: Observable<Payment[]> = this.store.pipe(select(selectPaymentHistory));
  paymentHistoryLoading$: Observable<boolean> = this.store.pipe(select(selectPaymentHistoryLoading));

  changePlanLoading$: Observable<boolean> = this.store.pipe(select(selectChangePlanLoading));

  billingInfo$: Observable<BillingInfo> = this.store.pipe(select(selectBillingInfo));
  hasPaymentMethod$: Observable<boolean> = this.store.pipe(select(selectHasPaymentMethod));
  hadBilling$: Observable<boolean> = this.store.pipe(select(selectHadBilling));
  willBeCancelled$: Observable<boolean> = this.store.pipe(select(selectWillBeCancelled));
  subscriptionExpiryDate$: Observable<Date> = this.store.pipe(select(selectSubscriptionExpiryDate));

  activePlanName$: Observable<string> = this.userFacade.plan$.pipe(map((plan: Plan) => getPlanName(plan)));

  constructor(
    private store: Store<fromBilling.State>,
    private changePlanService: ChangePlanService,
    private userFacade: UserFacade
  ) {
  }

  load(): void {
    this.store.dispatch(BillingActions.loadBillingInfo());
  }

  updatePaymentMethod(card: Card): void {
    this.store.dispatch(BillingActions.updatePaymentMethod({ card }));
  }

  deletePaymentMethod(): void {
    this.store.dispatch(BillingActions.deletePaymentMethod());
  }

  startPaymentProcess(): void {
    this.store.dispatch(BillingActions.changePlanLoading({ loading: true }));
  }

  hideLoader(): void {
    this.store.dispatch(BillingActions.changePlanLoading({ loading: false }));
  }

  changePlan(handler: ChangePlanHandler, plan: Plan, card?: Card, couponId?: string, reason?: string): void {
    this.store.dispatch(BillingActions.changePlanLoading({ loading: true }));
    this.changePlanService
      .changePlan(handler, plan, card, couponId, reason)
      .subscribe(() => this.store.dispatch(BillingActions.changePlanLoading({ loading: false })));
  }

  retryChangePlan(handler: ChangePlanHandler, plan: Plan, card: Card, pendingInvoice: string, couponId?: string): void {
    this.store.dispatch(BillingActions.changePlanLoading({ loading: true }));
    this.changePlanService
      .retryChangePlan(handler, plan, card, pendingInvoice, couponId)
      .subscribe(() => this.store.dispatch(BillingActions.retryChangePlanLoading({ loading: false })));
  }

  clearUpdatePaymentMethodFailed(): void {
    this.store.dispatch(BillingActions.clearUpdatePaymentMethodFailed());
  }

  loadPaymentHistory(): void {
    this.store.dispatch(BillingActions.loadPaymentHistory());
  }

  verifyInvoicePayed(paymentIntentId: string): Observable<void> {
    return this.changePlanService.verifyInvoicePayed(paymentIntentId).pipe(
      tap(() => {
        this.store.dispatch(BillingActions.changePlanLoading({ loading: false }));
        this.store.dispatch(BillingActions.changePlanSuccess());
      }),
      catchError(() => {
        this.store.dispatch(BillingActions.changePlanFailed());
        return of(null);
      })
    );
  }
}
