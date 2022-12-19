import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BakeryCommonModule } from '@common/public-api';
import { CommonModule } from '@angular/common';
import { TriAlertModule } from '@gradii/triangle/alert';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriInputModule } from '@gradii/triangle/input';

import { CouponComponent } from './coupon.component';
import { RedeemCouponComponent } from './redeem-coupon.component';
import { CouponStateService } from '@shared/redeem-coupon/coupon-state.service';
import { FormControlDisabledDirective } from '@shared/redeem-coupon/form-control-disabled.directive';
import { DiscountPipe } from '@shared/redeem-coupon/discount.pipe';

@NgModule({
  imports     : [
    CommonModule,
    BakeryCommonModule,
    ReactiveFormsModule,
    TriInputModule,
    TriAlertModule,
    TriButtonModule
  ],
  declarations: [CouponComponent, RedeemCouponComponent, FormControlDisabledDirective, DiscountPipe],
  exports     : [CouponComponent, RedeemCouponComponent, DiscountPipe],
  providers   : [CouponStateService]
})
export class CouponModule {
}
