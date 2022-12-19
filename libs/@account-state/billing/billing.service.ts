import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BillingInfo } from '@account-state/billing/billing-info.model';
import { Payment } from '@account-state/billing/payment.model';
import { environment } from '@environments';
import { Card } from '@workbench-interfaces';

export enum Plan {
  FREE = 'FREE',

  TEMPLATE_MONTHLY = 'TEMPLATE_MONTHLY',
  LIGHT_MONTHLY = 'LIGHT_MONTHLY',
  STANDARD_MONTHLY = 'STANDARD_MONTHLY',
  STARTUPS_MONTHLY = 'STARTUPS_MONTHLY',

  TEMPLATE_ANNUALLY = 'TEMPLATE_ANNUALLY',
  LIGHT_ANNUALLY = 'LIGHT_ANNUALLY',
  STANDARD_ANNUALLY = 'STANDARD_ANNUALLY',
  STARTUPS_ANNUALLY = 'STARTUPS_ANNUALLY',
}

export const plansOrder: Plan[] = [
  Plan.FREE,
  Plan.TEMPLATE_MONTHLY,
  Plan.LIGHT_MONTHLY,
  Plan.STARTUPS_MONTHLY,
  Plan.STANDARD_MONTHLY,

  Plan.TEMPLATE_ANNUALLY,
  Plan.LIGHT_ANNUALLY,
  Plan.STARTUPS_ANNUALLY,
  Plan.STANDARD_ANNUALLY
];

export function getPlanName(plan: Plan): string {
  return planNamesMapping[plan];
}

const planNamesMapping = {
  [Plan.FREE]: 'FREE',
  [Plan.TEMPLATE_MONTHLY]: 'TEMPLATE MAKER',
  [Plan.LIGHT_MONTHLY]: 'FRONTEND MAKER',
  [Plan.STARTUPS_MONTHLY]: 'STARTUPS',
  [Plan.STANDARD_MONTHLY]: 'WEB APP MAKER',

  [Plan.TEMPLATE_ANNUALLY]: 'TEMPLATE MAKER',
  [Plan.LIGHT_ANNUALLY]: 'FRONTEND MAKER',
  [Plan.STARTUPS_ANNUALLY]: 'STARTUPS',
  [Plan.STANDARD_ANNUALLY]: 'WEB APP MAKER'
};

@Injectable()
export class BillingService {
  private baseUrl = `${environment.apiUrl}/billing`;

  constructor(private http: HttpClient) {
  }

  billingInfo(): Observable<BillingInfo> {
    return this.http.get<BillingInfo>(`${this.baseUrl}/billing-info`);
  }

  updatePaymentMethod(card: Card): Observable<BillingInfo> {
    return this.http.put<BillingInfo>(`${this.baseUrl}/payment-method`, card);
  }

  deletePaymentMethod(): Observable<BillingInfo> {
    return this.http.delete<BillingInfo>(`${this.baseUrl}/payment-method`);
  }

  changePlan(plan: Plan, card?: Card, couponId?: string, reason?: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/change-plan`, { plan, card, couponId, reason });
  }

  retryChangePlan(plan: Plan, card: Card, pendingInvoice: string, couponId?: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/retry-change-plan`, { plan, card, pendingInvoice, couponId });
  }

  loadPaymentHistory(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/history`);
  }

  verifyInvoicePayed(paymentIntentId: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/verify-invoice-paid`, paymentIntentId);
  }
}
