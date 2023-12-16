import { Injectable } from '@angular/core';
import { switchMap, take } from 'rxjs/operators';
import { NbDialogRef } from '@nebular/theme';
import { Observable } from 'rxjs';

import { BillingFacade } from '@account-state/billing/billing.facade';
import { DialogService } from '@shared/dialog/dialog.service';
import { UpgradePlanDialogComponent } from '../upgrade-plan-dialog/upgrade-plan-dialog.component';
import { ConfirmUpgradePlanDialogComponent } from '../confirm-upgrade-plan-dialog/confirm-upgrade-plan-dialog.component';
import { AvailablePlan } from './plans';

@Injectable()
export class PlansService {
  constructor(private billingFacade: BillingFacade, private dialogService: DialogService) {
  }

  upgrade(plan: AvailablePlan): Observable<any> {
    return this.billingFacade.hasPaymentMethod$.pipe(
      take(1),
      switchMap((hadBilling: boolean) => {
        if (hadBilling) {
          const dialogRef: NbDialogRef<ConfirmUpgradePlanDialogComponent> = this.dialogService.open(
            ConfirmUpgradePlanDialogComponent,
            {
              closeOnBackdropClick: false,
              closeOnEsc: false
            }
          );
          dialogRef.componentRef.instance.plan = plan;
          dialogRef.componentRef.changeDetectorRef.detectChanges();

          return dialogRef.onClose;
        } else {
          const dialogRef: NbDialogRef<UpgradePlanDialogComponent> = this.dialogService.open(
            UpgradePlanDialogComponent,
            {
              closeOnBackdropClick: false,
              closeOnEsc: false,
              autoFocus: false
            }
          );
          dialogRef.componentRef.instance.plan = plan;
          dialogRef.componentRef.changeDetectorRef.detectChanges();

          return dialogRef.onClose;
        }
      })
    );
  }
}
