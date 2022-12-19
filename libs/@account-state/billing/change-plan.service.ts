import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { AnalyticsService } from '@common/public-api';
import { BillingService, Plan } from '@account-state/billing/billing.service';
import { UserFacade } from '@auth/user-facade.service';
import { Card } from '@workbench-interfaces';

export interface ChangePlanHandler {
  handleActionRequired(clientSecret: string): void;

  handlePaymentDeclined(pendingInvoice: string): void;

  handleSuccess(): void;

  handleInvalidCard(): void;

  handleUnexpectedError(): void;
}

@Injectable()
export class ChangePlanService {
  constructor(
    private userFacade: UserFacade,
    private analytics: AnalyticsService,
    private billingService: BillingService
  ) {
  }

  changePlan(handler: ChangePlanHandler, plan: Plan, card?: Card, couponId?: string, reason?: string): Observable<any> {
    return this.billingService.changePlan(plan, card, couponId, reason).pipe(
      withLatestFrom(this.userFacade.plan$),
      tap(([token, currentPlan]) => this.analytics.logChangePlanUI(currentPlan, plan)),
      mergeMap(([token]: [string, Plan]) => this.userFacade.setToken(token)),
      map(() => handler.handleSuccess.call(handler)),
      catchError(({ error }) => {
        this.handleError(handler, error);
        return of();
      })
    );
  }

  retryChangePlan(
    handler: ChangePlanHandler,
    plan: Plan,
    card: Card,
    pendingInvoice: string,
    couponId?: string
  ): Observable<any> {
    return this.billingService.retryChangePlan(plan, card, pendingInvoice, couponId).pipe(
      mergeMap((token: string) => this.userFacade.setToken(token)),
      map(() => handler.handleSuccess.call(handler)),
      catchError(({ error }) => {
        this.handleError(handler, error);
        return of();
      })
    );
  }

  verifyInvoicePayed(paymentIntentId: string): Observable<void> {
    return this.billingService
      .verifyInvoicePayed(paymentIntentId)
      .pipe(mergeMap((token: string) => this.userFacade.setToken(token)));
  }

  private handleError(handler: ChangePlanHandler, error) {
    const errorHandler = {
      'action-required': () => handler.handleActionRequired(error.clientSecret),
      'payment-required': () => handler.handlePaymentDeclined(error.invoiceId),
      'invalid-card': () => handler.handleInvalidCard()
    };

    if (error && error.reason in errorHandler) {
      errorHandler[error.reason]();
    } else {
      handler.handleUnexpectedError();
    }
  }
}
