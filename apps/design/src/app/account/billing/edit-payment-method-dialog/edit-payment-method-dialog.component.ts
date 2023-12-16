import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { BillingFacade } from '@account-state/billing/billing.facade';
import { DialogRef } from '@shared/dialog/dialog-ref';
import { Card } from '../services/stripe-provider.service';

@Component({
  selector: 'ub-edit-payment-method',
  styleUrls: ['./edit-payment-method-dialog.component.scss'],
  templateUrl: './edit-payment-method-dialog.component.html'
})
export class EditPaymentMethodDialogComponent {
  updatePaymentMethodLoading$: Observable<boolean> = this.billingFacade.updatePaymentMethodLoading$;

  constructor(private billingFacade: BillingFacade, private dialogRef: DialogRef<EditPaymentMethodDialogComponent>) {
  }

  updatePaymentMethod(card: Card) {
    this.billingFacade.updatePaymentMethod(card);

    this.updatePaymentMethodLoading$
      .pipe(
        filter((loading: boolean) => !loading),
        take(1)
      )
      .subscribe(() => this.dialogRef.close());
  }

  close() {
    this.dialogRef.close();
  }
}
