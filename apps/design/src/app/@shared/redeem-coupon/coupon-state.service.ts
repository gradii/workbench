import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, finalize, map, tap } from 'rxjs/operators';

import { Coupon } from '@shared/redeem-coupon/coupon';
import { CouponService } from '@shared/redeem-coupon/coupon.service';
import { UserFacade } from '@auth/user-facade.service';

@Injectable()
export class CouponStateService {
  private coupon = new BehaviorSubject<Coupon>(null);
  readonly coupon$: Observable<Coupon> = this.coupon.asObservable();

  readonly perks$: Observable<string> = this.coupon$.pipe(
    filter(c => !!c),
    map((coupon: Coupon) => coupon.perks)
  );

  private loading = new BehaviorSubject(false);
  readonly loading$: Observable<boolean> = this.loading.asObservable();

  constructor(private couponService: CouponService, private userFacade: UserFacade) {
  }

  verify(couponId: string): Observable<boolean> {
    if (!couponId) {
      this.coupon.next(null);
      return of(null);
    }

    this.loading.next(true);

    return this.couponService.verify(couponId).pipe(
      tap((coupon: Coupon) => this.coupon.next(coupon)),
      map((coupon: Coupon) => !!coupon),
      catchError(() => {
        this.coupon.next(null);
        return of(false);
      }),
      finalize(() => this.loading.next(false))
    );
  }

  redeem(couponId: string) {
    this.loading.next(true);
    return this.couponService.redeem(couponId).pipe(
      tap((token: string) => this.userFacade.setToken(token)),
      finalize(() => this.loading.next(false))
    );
  }

  clearCoupon() {
    this.coupon.next(null);
  }
}
