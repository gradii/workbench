import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { CouponStateService } from '@shared/redeem-coupon/coupon-state.service';

@Component({
  selector: 'ub-redeem-coupon',
  template: `
    <h2 class="h6 heading-margin-bottom">Coupons and Discounts</h2>

    <nb-alert
      *ngIf="showCouponRedeemedAlert$ | async"
      status="success"
      outline="success"
      closable
      (close)="showCouponRedeemedAlert$.next(false)"
    >
      Coupon successfully redeemed!
    </nb-alert>

    <form [formGroup]="form" (ngSubmit)="redeem()" class="bc-form component-list-margin-sm">
      <ub-coupon formControlName="coupon" required></ub-coupon>
      <button type="submit" [disabled]="!form.valid" nbButton status="primary">Redeem</button>
    </form>
  `,
  styleUrls: ['./redeem-coupon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedeemCouponComponent {
  showCouponRedeemedAlert$ = new BehaviorSubject<boolean>(false);
  form = new FormGroup({ coupon: new FormControl() });

  constructor(private couponState: CouponStateService) {
  }

  redeem() {
    this.couponState.redeem(this.form.value.coupon).subscribe(() => {
      this.clearCoupon();
      this.showCouponRedeemedAlert$.next(true);
    });
  }

  private clearCoupon() {
    this.form.controls.coupon.setValue(null);
    this.couponState.clearCoupon();
  }
}
