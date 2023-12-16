import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BillingFacade } from '@account-state/billing/billing.facade';
import { Plan } from '@account-state/billing/billing.service';
import { DialogService } from '@shared/dialog/dialog.service';
import { ConfirmCancelSubscriptionDialogComponent } from '../confirm-cancel-subscription-dialog/confirm-cancel-subscription-dialog.component';
import { UserFacade } from '@auth/user-facade.service';

@Component({
  selector: 'ub-manage-plan',
  styleUrls: ['./manage-plan.component.scss'],
  templateUrl: './manage-plan.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManagePlanComponent {
  private isFreePlan$: Observable<boolean> = this.userFacade.plan$.pipe(map((plan: Plan) => plan === Plan.FREE));

  canCancel$: Observable<boolean> = combineLatest([this.isFreePlan$, this.billingFacade.willBeCancelled$]).pipe(
    map(([free, willBeCancelled]) => !free && !willBeCancelled)
  );

  constructor(
    private billingFacade: BillingFacade,
    private userFacade: UserFacade,
    private dialogService: DialogService
  ) {
  }

  cancelSubscription() {
    this.dialogService.open(ConfirmCancelSubscriptionDialogComponent);
  }
}
