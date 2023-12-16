import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Coupon } from '@shared/redeem-coupon/coupon';

@Injectable({ providedIn: 'root' })
export class CouponService {
  private baseUrl = `${environment.apiUrl}/coupon`;

  constructor(private http: HttpClient) {
  }

  verify(couponId: string): Observable<Coupon> {
    const encodedCoupon: string = encodeURIComponent(couponId);
    return this.http.get<Coupon>(`${this.baseUrl}/${encodedCoupon}/verify`);
  }

  redeem(couponId: string): Observable<string> {
    const encodedCoupon: string = encodeURIComponent(couponId);
    return this.http.get<string>(`${this.baseUrl}/${encodedCoupon}/redeem`);
  }
}
