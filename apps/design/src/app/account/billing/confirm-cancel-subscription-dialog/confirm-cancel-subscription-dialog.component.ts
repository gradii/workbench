import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getConfigValue } from '@common';
import { Observable } from 'rxjs';

import { BillingFacade } from '@account-state/billing/billing.facade';
import { DialogRef } from '@shared/dialog/dialog-ref';
import { Plan } from '@account-state/billing/billing.service';
import { ChangePlanHandler } from '@account-state/billing/change-plan.service';
import { containsAtLeastNCharsOrWhitespace } from '@common';

@Component({
  selector: 'ub-confirm-cancel-subscription-dialog',
  styleUrls: ['./confirm-cancel-subscription-dialog.component.scss'],
  templateUrl: './confirm-cancel-subscription-dialog.component.html'
})
export class ConfirmCancelSubscriptionDialogComponent implements ChangePlanHandler {
  downgradeForm: FormGroup = this.fb.group({
    reason: [
      '',
      [
        Validators.required,
        containsAtLeastNCharsOrWhitespace(getConfigValue('account.subscription.cancelReasonMinLength'))
      ]
    ]
  });

  changePlanLoading$: Observable<boolean> = this.billingFacade.changePlanLoading$;

  constructor(
    private billingFacade: BillingFacade,
    private dialogRef: DialogRef<ConfirmCancelSubscriptionDialogComponent>,
    private fb: FormBuilder
  ) {
  }

  changePlan(): void {
    this.billingFacade.changePlan(this, Plan.FREE, null, null, this.downgradeForm.value.reason);
  }

  closeDialog(res?): void {
    this.dialogRef.close(res);
  }

  handleActionRequired(clientSecret: string): void {
  }

  handlePaymentDeclined(pendingInvoice: string): void {
  }

  handleSuccess(): void {
    this.closeDialog();
  }

  handleInvalidCard(): void {
  }

  handleUnexpectedError(): void {
    this.billingFacade.hideLoader();
    this.closeDialog({ errored: true });
  }

  get reason(): AbstractControl {
    return this.downgradeForm && this.downgradeForm.controls['reason'];
  }
}
