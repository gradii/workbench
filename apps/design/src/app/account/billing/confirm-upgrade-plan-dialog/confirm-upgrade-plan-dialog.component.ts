import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Observable } from 'rxjs';

import { BillingFacade } from '@account-state/billing/billing.facade';
import { DialogRef } from '@shared/dialog/dialog-ref';
import { AvailablePlan } from '../plans/plans';
import { ChangePlanHandler } from '@account-state/billing/change-plan.service';
import { StripeProvider } from '../services/stripe-provider.service';
import { UpgradePlanDialogComponent } from '../upgrade-plan-dialog/upgrade-plan-dialog.component';
import { DialogService } from '@shared/dialog/dialog.service';
import { Store } from '@ngrx/store';
import { fromBilling } from '@account-state/billing/billing.reducer';
import { BillingActions } from '@account-state/billing/billing.actions';

@Component({
  selector: 'ub-confirm-upgrade-plan-dialog',
  styleUrls: ['./confirm-upgrade-plan-dialog.component.scss'],
  templateUrl: './confirm-upgrade-plan-dialog.component.html',
  providers: [StripeProvider],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmUpgradePlanDialogComponent implements ChangePlanHandler {
  get periodName(): 'month' | 'year' {
    if (this.plan.billingPeriod === 'monthly') {
      return 'month';
    }
    return 'year';
  }

  @Input() plan: AvailablePlan;

  changePlanLoading$: Observable<boolean> = this.billingFacade.changePlanLoading$;

  constructor(
    private billingFacade: BillingFacade,
    private dialogRef: DialogRef<ConfirmUpgradePlanDialogComponent>,
    private stripeProvider: StripeProvider,
    private dialogService: DialogService,
    private store: Store<fromBilling.State>
  ) {
  }

  changePlan(): void {
    this.billingFacade.changePlan(this, this.plan.plan);
  }

  closeDialog(res?): void {
    this.dialogRef.close(res);
  }

  handleActionRequired(clientSecret: string): void {
    this.stripeProvider
      .handleCardPayment(clientSecret)
      .subscribe((res: stripe.PaymentIntentResponse) => this.handlePaymentResponse(res));
  }

  handleInvalidCard(): void {
  }

  handlePaymentDeclined(pendingInvoice: string): void {
    // TODO refactor
    const dialogRef: NbDialogRef<UpgradePlanDialogComponent> = this.dialogService.open(UpgradePlanDialogComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      autoFocus: false
    });
    dialogRef.componentRef.instance.plan = this.plan;
    dialogRef.componentRef.changeDetectorRef.detectChanges();
    dialogRef.componentRef.instance.handlePaymentDeclined(pendingInvoice);
    this.closeDialog();
  }

  handleSuccess(): void {
    this.closeDialog(this.plan);
  }

  handleUnexpectedError(): void {
    this.billingFacade.hideLoader();
    this.closeDialog({ errored: true });
  }

  private handlePaymentResponse(res: stripe.PaymentIntentResponse) {
    const { error } = res;

    if (error) {
      this.store.dispatch(BillingActions.changePlanFailed());
      this.store.dispatch(BillingActions.changePlanLoading({ loading: false }));
      this.closeDialog();
    } else {
      this.billingFacade.verifyInvoicePayed(res.paymentIntent.id).subscribe(() => this.closeDialog());
    }
  }
}
