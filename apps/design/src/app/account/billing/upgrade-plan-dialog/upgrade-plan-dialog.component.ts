import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { BillingFacade } from '@account-state/billing/billing.facade';
import { fromBilling } from '@account-state/billing/billing.reducer';
import { BillingActions } from '@account-state/billing/billing.actions';
import { ChangePlanHandler } from '@account-state/billing/change-plan.service';
import { DialogRef } from '@shared/dialog/dialog-ref';
import { CardComponent } from '../card/card.component';
import { Card } from '../services/stripe-provider.service';
import { AvailablePlan } from '../plans/plans';
import { UserFacade } from '@auth/user-facade.service';

@Component({
  selector: 'ub-upgrade-plan-dialog',
  styleUrls: ['./upgrade-plan-dialog.component.scss'],
  templateUrl: './upgrade-plan-dialog.component.html'
})
export class UpgradePlanDialogComponent implements ChangePlanHandler {
  @ViewChild(CardComponent) card: CardComponent;

  @Input() plan: AvailablePlan;

  coupon = new FormControl();

  changePlanLoading$: Observable<boolean> = this.billingFacade.changePlanLoading$;

  private pendingInvoice: string;
  private errors = new BehaviorSubject<string>('');
  errors$: Observable<string> = this.errors.asObservable();

  constructor(
    private billingFacade: BillingFacade,
    private userFacade: UserFacade,
    private dialogRef: DialogRef<UpgradePlanDialogComponent>,
    private router: Router,
    private store: Store<fromBilling.State>
  ) {
  }

  changePlan(card: Card): void {
    this.errors.next('');
    if (this.pendingInvoice) {
      this.billingFacade.retryChangePlan(this, this.plan.plan, card, this.pendingInvoice, this.coupon.value);
    } else {
      this.billingFacade.changePlan(this, this.plan.plan, card, this.coupon.value);
    }
  }

  showLoader() {
    this.billingFacade.startPaymentProcess();
  }

  handleError(error: string) {
    this.billingFacade.hideLoader();
    this.errors.next(error);
  }

  handleActionRequired(clientSecret: string): void {
    this.card
      .handleCardPayment(clientSecret)
      .subscribe((res: stripe.PaymentIntentResponse) => this.handlePaymentResponse(res));
  }

  handlePaymentDeclined(pendingInvoice: string): void {
    this.pendingInvoice = pendingInvoice;
    this.card.recollectPaymentMethod();
  }

  handleSuccess(): void {
    this.closeDialog(this.plan);
  }

  handleInvalidCard(): void {
    this.errors.next('Invalid card information');
    this.billingFacade.hideLoader();
  }

  handleUnexpectedError(): void {
    this.billingFacade.hideLoader();
    this.close({ errored: true });
  }

  close(res?): void {
    this.dialogRef.close(res);
  }

  private closeDialog(plan?: AvailablePlan): void {
    this.close(plan);
    this.router.navigateByUrl('/settings/billing');
  }

  private handlePaymentResponse(res: stripe.PaymentIntentResponse) {
    const { error } = res;

    if (error) {
      this.store.dispatch(BillingActions.changePlanFailed());
      this.closeDialog();
    } else {
      this.billingFacade.verifyInvoicePayed(res.paymentIntent.id).subscribe(() => this.closeDialog());
    }
  }
}

