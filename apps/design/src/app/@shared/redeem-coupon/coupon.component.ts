import { ChangeDetectionStrategy, Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  AsyncValidator,
  ControlValueAccessor,
  FormControl,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors
} from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay, takeUntil } from 'rxjs/operators';
import { getConfigValue } from '@common';

import { CouponStateService } from '@shared/redeem-coupon/coupon-state.service';
import { Coupon } from '@shared/redeem-coupon/coupon';
import { UserFacade } from '@auth/user-facade.service';

@Component({
  selector: 'ub-coupon',
  templateUrl: './coupon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CouponComponent), multi: true },
    { provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => CouponComponent), multi: true }
  ]
})
export class CouponComponent implements OnInit, OnDestroy, ControlValueAccessor, AsyncValidator {
  @Input() withStatus = true;

  coupon = new FormControl();
  perks$: Observable<string> = this.couponState.perks$;
  coupon$: Observable<Coupon> = this.userFacade.coupon$;
  loading$: Observable<boolean> = this.couponState.loading$.pipe(shareReplay());
  status$: Observable<string> = this.couponState.coupon$.pipe(
    map((coupon: Coupon) => {
      if (!this.coupon.value || !this.withStatus) {
        return 'basic';
      }

      if (!coupon) {
        return 'danger';
      }

      return 'success';
    }),
    shareReplay()
  );

  private destroy$ = new Subject<void>();
  onTouched: () => void = () => {
  };
  private onChange: (string) => any = () => {
  };

  constructor(private route: ActivatedRoute, private couponState: CouponStateService, private userFacade: UserFacade) {
  }

  validate(control: AbstractControl): Observable<ValidationErrors> {
    const couponId: string = this.coupon.value;
    if (couponId && couponId.length > getConfigValue('auth.coupon.maxLength')) {
      return of({ invalidCoupon: true });
    }
    return this.couponState.verify(couponId).pipe(map((valid: boolean) => (valid ? null : { invalidCoupon: true })));
  }

  writeValue(couponId: string): void {
    this.coupon.setValue(couponId);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    this.fillWithCoupon();
    this.notifyOnCouponChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private fillWithCoupon(): void {
    const couponId: string = this.getCoupon();
    this.couponState
      .verify(couponId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.writeValue(couponId));
  }

  private notifyOnCouponChange() {
    this.coupon.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(300), takeUntil(this.destroy$))
      .subscribe((couponId: string) => {
        if (typeof couponId === 'string') {
          this.onChange(couponId);
        } else {
          // Clear coupon manually, because validator will not be called for empty value
          this.couponState.clearCoupon();
        }
      });
  }

  private getCoupon(): string {
    return this.route.snapshot.queryParamMap.get('couponId');
  }
}
