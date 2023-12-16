import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule, NbButtonModule, NbInputModule, NbSpinnerModule } from '@nebular/theme';
import { BakeryCommonModule } from '@common';
import { CommonModule } from '@angular/common';

import { CouponComponent } from './coupon.component';
import { RedeemCouponComponent } from './redeem-coupon.component';
import { CouponStateService } from '@shared/redeem-coupon/coupon-state.service';
import { FormControlDisabledDirective } from '@shared/redeem-coupon/form-control-disabled.directive';
import { DiscountPipe } from '@shared/redeem-coupon/discount.pipe';

@NgModule({
  imports: [
    CommonModule,
    BakeryCommonModule,
    ReactiveFormsModule,
    NbInputModule,
    NbSpinnerModule,
    NbButtonModule,
    NbAlertModule
  ],
  declarations: [CouponComponent, RedeemCouponComponent, FormControlDisabledDirective, DiscountPipe],
  exports: [CouponComponent, RedeemCouponComponent, DiscountPipe],
  providers: [CouponStateService]
})
export class CouponModule {
}
