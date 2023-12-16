import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { DialogService } from '@shared/dialog/dialog.service';
import { EditPaymentMethodDialogComponent } from '../edit-payment-method-dialog/edit-payment-method-dialog.component';
import { RemovePaymentMethodDialogComponent } from '../remove-payment-method-dialog/remove-payment-method-dialog.component';
import { BillingFacade } from '@account-state/billing/billing.facade';
import { BillingInfo } from '@account-state/billing/billing-info.model';

@Component({
  selector: 'ub-payment-method',
  styleUrls: ['./payment-method.component.scss'],
  templateUrl: './payment-method.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentMethodComponent {
  billingInfo$: Observable<BillingInfo> = this.billingFacade.billingInfo$.pipe(filter(a => !!a));

  last4$: Observable<string> = this.billingInfo$.pipe(map((billingInfo: BillingInfo) => billingInfo.cardLast4 || ''));

  expiration$: Observable<string> = this.billingInfo$.pipe(
    map(({ cardExpirationMonth, cardExpirationYear }) => `${cardExpirationMonth}/${cardExpirationYear}`)
  );

  cardBrand$: Observable<string> = this.billingInfo$.pipe(map((billingInfo: BillingInfo) => billingInfo.cardBrand));

  cardInfoExist$: Observable<boolean> = combineLatest([this.last4$, this.billingInfo$]).pipe(
    map(([last4, billingInfo]) => {
      return !!last4 && !!billingInfo && !!billingInfo.cardExpirationMonth && !!billingInfo.cardExpirationYear;
    })
  );

  constructor(private dialogService: DialogService, private billingFacade: BillingFacade) {
  }

  edit() {
    this.dialogService.open(EditPaymentMethodDialogComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      autoFocus: false
    });
  }

  remove() {
    this.dialogService.open(RemovePaymentMethodDialogComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }
}
