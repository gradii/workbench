import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { DialogService } from '@shared/dialog/dialog.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnalyticsService } from '@common';

import { Plan, plansOrder } from '@account-state/billing/billing.service';
import { BillingFacade } from '@account-state/billing/billing.facade';
import { SubscriptionReasonSurveyComponent } from '../subscription-reason-survey/subscription-reason-survey.component';
import { PlansService } from './plans.service';
import { AvailablePlan, PLANS_ANNUALLY, PLANS_MONTHLY } from './plans';
import { UserFacade } from '@auth/user-facade.service';
import { CouponStateService } from '@shared/redeem-coupon/coupon-state.service';

@Component({
  selector: 'ub-plans',
  styleUrls: ['./plans.component.scss'],
  templateUrl: './plans.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlansComponent implements OnInit {
  currentPlan$: Observable<Plan> = this.userFacade.plan$;
  activePlanName$: Observable<string> = this.billingFacade.activePlanName$;
  billingInfoLoading$: Observable<boolean> = this.billingFacade.loadBillingInfo$;
  monthlyPlans$: Observable<AvailablePlan[]> = this.createPlans(PLANS_MONTHLY);
  annuallyPlans$: Observable<AvailablePlan[]> = this.createPlans(PLANS_ANNUALLY);
  showUnexpectedErrorAlert$ = new BehaviorSubject(false);
  hasDiscountsInMonthlyPlans$: Observable<boolean> = this.monthlyPlans$.pipe(map(plans => this.hasDiscount(plans)));
  hasDiscountsInAnnualPlans$: Observable<boolean> = this.annuallyPlans$.pipe(map(plans => this.hasDiscount(plans)));

  constructor(
    private plansService: PlansService,
    private billingFacade: BillingFacade,
    private userFacade: UserFacade,
    private couponStateService: CouponStateService,
    private analytics: AnalyticsService,
    private dialogService: DialogService
  ) {
  }

  ngOnInit(): void {
    this.billingFacade.load();
  }

  upgrade(plan: AvailablePlan) {
    this.analytics.logPaymentCardPopupOpened();
    this.plansService.upgrade(plan).subscribe(res => {
      this.couponStateService.clearCoupon();

      if (!res) {
        return;
      }

      if (res.plan) {
        // plan present, it means the upgrade was successful
        this.askForUpgradeReason(res);
      } else {
        // if no plan in response - it's a stripe error
        this.showUnexpectedErrorAlert$.next(res.errored);
      }
    });
  }

  private askForUpgradeReason(res) {
    const dialogRef: NbDialogRef<SubscriptionReasonSurveyComponent> = this.dialogService.open(
      SubscriptionReasonSurveyComponent,
      {
        closeOnEsc: false,
        closeOnBackdropClick: false
      }
    );
    dialogRef.componentRef.instance.planName = res.plan;
  }

  private createPlans(plans: AvailablePlan[]): Observable<AvailablePlan[]> {
    return this.currentPlan$.pipe(
      map((plan: Plan) => {
        const availableStarts: number = plansOrder.findIndex((aplan: Plan) => aplan === plan);
        const availablePlans: Plan[] = plansOrder.slice(availableStarts + 1);
        return plans.filter((p: AvailablePlan) => availablePlans.includes(p.plan));
      })
    );
  }

  private hasDiscount(plans: AvailablePlan[]): boolean {
    return plans.some(p => p.priceBeforeDiscount != null);
  }
}
