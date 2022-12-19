import { Pipe, PipeTransform } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { UserFacade } from '@auth/user-facade.service';
import { CouponStateService } from '@shared/redeem-coupon/coupon-state.service';
import { Coupon } from '@shared/redeem-coupon/coupon';

@Pipe({ name: 'discount' })
export class DiscountPipe implements PipeTransform {
  constructor(private userFacade: UserFacade, private couponState: CouponStateService) {
  }

  transform(price: number, undiscounted = false): Observable<string> {
    return this.resolveCoupon().pipe(
      map((coupon: Coupon) => {
        const resultingPrice = this.calculateResultingPrice(coupon, price, undiscounted);
        return this.format(resultingPrice);
      })
    );
  }

  private resolveCoupon(): Observable<Coupon> {
    return this.userFacade.coupon$.pipe(
      switchMap((userCoupon: Coupon) => {
        if (!userCoupon) {
          return this.couponState.coupon$;
        }
        return of(userCoupon);
      })
    );
  }

  private calculateResultingPrice(coupon: Coupon, price: number, undiscounted: boolean): number {
    if (coupon && coupon.discount && !undiscounted) {
      return this.calculateDiscount(price, coupon.discount);
    } else {
      return price;
    }
  }

  private calculateDiscount(price: number, discountPercent: number): number {
    const discount = (price * discountPercent) / 100;
    return price - discount;
  }

  private format(price: number): string {
    if (Number.isInteger(price)) {
      return `${price}`;
    } else {
      return price.toFixed(2);
    }
  }
}
