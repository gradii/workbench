import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { BillingFacade } from '@account-state/billing/billing.facade';
import { DialogRef } from '@shared/dialog/dialog-ref';

@Component({
  selector: 'ub-remove-payment-method',
  styleUrls: ['./remove-payment-method-dialog.component.scss'],
  templateUrl: './remove-payment-method-dialog.component.html'
})
export class RemovePaymentMethodDialogComponent {
  deletePaymentMethodLoading$: Observable<boolean> = this.billingFacade.deletePaymentMethodLoading$;

  constructor(private billingFacade: BillingFacade, private dialogRef: DialogRef<RemovePaymentMethodDialogComponent>) {
  }

  cancel() {
    this.dialogRef.close();
  }

  remove() {
    this.billingFacade.deletePaymentMethod();

    this.deletePaymentMethodLoading$
      .pipe(
        filter((loading: boolean) => !loading),
        take(1)
      )
      .subscribe(() => this.dialogRef.close());
  }
}
