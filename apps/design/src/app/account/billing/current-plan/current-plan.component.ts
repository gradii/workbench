import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { BillingFacade } from '@account-state/billing/billing.facade';
import { UserFacade } from '@auth/user-facade.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ub-current-plan',
  styleUrls: ['./current-plan.component.scss'],
  templateUrl: './current-plan.component.html'
})
export class CurrentPlanComponent {
  plan$: Observable<string> = this.billingFacade.activePlanName$;
  expiryDate$: Observable<Date> = this.billingFacade.subscriptionExpiryDate$;
  willBeCancelled$: Observable<boolean> = this.userFacade.subscriptionStatus$.pipe(
    map(status => status === 'WILL_BE_CANCELLED')
  );

  constructor(private billingFacade: BillingFacade, private userFacade: UserFacade) {
  }
}
