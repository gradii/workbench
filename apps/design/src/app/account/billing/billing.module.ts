import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSpinnerModule,
  NbTabsetModule
} from '@nebular/theme';
import { BakeryCommonModule } from '@common';

import { AccountCommonModule } from '../common/common.module';
import { BillingFacade } from '@account-state/billing/billing.facade';
import { BillingComponent } from './billing.component';
import { BillingService } from '@account-state/billing/billing.service';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { EditPaymentMethodDialogComponent } from './edit-payment-method-dialog/edit-payment-method-dialog.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { CurrentPlanComponent } from './current-plan/current-plan.component';
import { ManagePlanComponent } from './manage-plan/manage-plan.component';
import { RemovePaymentMethodDialogComponent } from './remove-payment-method-dialog/remove-payment-method-dialog.component';
import { CardComponent } from './card/card.component';
import { UpgradePlanDialogComponent } from './upgrade-plan-dialog/upgrade-plan-dialog.component';
import { PlanComponent } from './plan/plan.component';
import { PlansComponent } from './plans/plans.component';
import { PlansService } from './plans/plans.service';
import { ChangePlanService } from '@account-state/billing/change-plan.service';
import { ConfirmUpgradePlanDialogComponent } from './confirm-upgrade-plan-dialog/confirm-upgrade-plan-dialog.component';
import { ConfirmCancelSubscriptionDialogComponent } from './confirm-cancel-subscription-dialog/confirm-cancel-subscription-dialog.component';
import { CardIconComponent } from './card-icon/card-icon.component';
import { AmountPipe } from './payment-history/amount.pipe';
import { PlanPipe } from './payment-history/plan.pipe';
import { CouponModule } from '@shared/redeem-coupon/coupon.module';
import { DialogModule } from '@shared/dialog/dialog.module';
import { SubscriptionReasonSurveyComponent } from './subscription-reason-survey/subscription-reason-survey.component';
import { OtherReasonModalComponent } from './subscription-reason-survey/other-reason-modal/other-reason-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    BakeryCommonModule,
    AccountCommonModule,
    DialogModule,

    NbCardModule,
    NbButtonModule,
    NbDialogModule.forChild(),
    NbIconModule,
    NbSpinnerModule,
    NbAlertModule,
    NbTabsetModule,
    CouponModule,
    ReactiveFormsModule,
    NbRadioModule,
    NbInputModule
  ],
  declarations: [
    BillingComponent,
    PaymentInfoComponent,
    PaymentMethodComponent,
    PaymentHistoryComponent,
    CurrentPlanComponent,
    ManagePlanComponent,
    CardComponent,
    EditPaymentMethodDialogComponent,
    RemovePaymentMethodDialogComponent,
    PlansComponent,
    PlanComponent,
    UpgradePlanDialogComponent,
    ConfirmUpgradePlanDialogComponent,
    ConfirmCancelSubscriptionDialogComponent,
    CardIconComponent,
    AmountPipe,
    PlanPipe,
    SubscriptionReasonSurveyComponent,
    OtherReasonModalComponent
  ],
  entryComponents: [
    EditPaymentMethodDialogComponent,
    RemovePaymentMethodDialogComponent,
    UpgradePlanDialogComponent,
    ConfirmUpgradePlanDialogComponent,
    ConfirmCancelSubscriptionDialogComponent,
    SubscriptionReasonSurveyComponent,
    OtherReasonModalComponent
  ],
  providers: [BillingFacade, BillingService, PlansService, ChangePlanService]
})
export class BillingModule {
}
