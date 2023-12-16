import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NbIconLibraries } from '@nebular/theme';

import { BillingFacade } from '@account-state/billing/billing.facade';
import { registerCardBrandIcons } from './card-icon/card-brand-icons';

@Component({
  selector: 'ub-billing',
  styleUrls: ['./billing.component.scss'],
  templateUrl: './billing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingComponent implements OnInit, OnDestroy {
  updatePaymentMethodFailed$: Observable<boolean> = this.billingFacade.updatePaymentMethodFailed$;

  loadBillingInfo$: Observable<boolean> = this.billingFacade.loadBillingInfo$;

  loadBillingInfoFailed$: Observable<boolean> = this.billingFacade.loadBillingInfoFailed$;

  billingDisabled$: Observable<boolean> = combineLatest([this.loadBillingInfo$, this.loadBillingInfoFailed$]).pipe(
    map(([billingLoading, loadingFailed]: [boolean, boolean]) => billingLoading || loadingFailed)
  );

  constructor(private billingFacade: BillingFacade, iconLibraries: NbIconLibraries) {
    registerCardBrandIcons(iconLibraries);
  }

  ngOnInit(): void {
    this.billingFacade.load();
  }

  ngOnDestroy(): void {
    this.billingFacade.clearUpdatePaymentMethodFailed();
  }

  closeUpdateFailedAlert() {
    this.billingFacade.clearUpdatePaymentMethodFailed();
  }
}
