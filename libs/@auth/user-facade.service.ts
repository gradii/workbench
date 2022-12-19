import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Plan } from '@account-state/billing/billing.service';
import { Payload, PayloadService } from './payload.service';
import { UserService } from './user.service';
import { Coupon } from '@shared/redeem-coupon/coupon';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  readonly email$: Observable<string> = this.payloadService.payload$.pipe(map((payload: Payload) => payload.email));
  readonly accountName$: Observable<string> = this.payloadService.payload$.pipe(map((payload: Payload) => payload.accountName));
  readonly realName$: Observable<string> = this.payloadService.payload$.pipe(map((payload: Payload) => payload.realName));

  readonly plan$: Observable<Plan> = this.payloadService.payload$.pipe(map((payload: Payload) => payload.plan));

  readonly subscriptionStatus$: Observable<string> = this.payloadService.payload$.pipe(
    map((payload: Payload) => payload.subscriptionStatus)
  );

  readonly admin$: Observable<boolean> = this.payloadService.payload$.pipe(map((payload: Payload) => payload.admin));

  /**
   * @deprecated use permissionCodes$ instead
   */
  readonly role$: Observable<number> = this.payloadService.payload$.pipe(map((payload: Payload) => payload.role));

  readonly permissionCodes$: Observable<string[]> = this.payloadService.payload$.pipe(map((payload: Payload) => payload.permissionCodes));

  readonly featureAmplify$: Observable<boolean> = this.payloadService.payload$.pipe(
    map((payload: Payload) => payload.featureAmplify)
  );

  readonly coupon$: Observable<Coupon> = this.payloadService.payload$.pipe(map((payload: Payload) => payload.coupon));

  readonly createdAt$: Observable<Date> = this.payloadService.payload$.pipe(
    map((payload: Payload) => payload.createdAt)
  );

  readonly viewedResponsiveStyleNotification$: Observable<boolean> = this.payloadService.payload$.pipe(
    map((payload: Payload) => payload.viewedResponsiveStyleNotification)
  );

  readonly viewedOnboarding$: Observable<boolean> = this.payloadService.payload$.pipe(
    map((payload: Payload) => payload.viewedOnboarding)
  );

  readonly viewedTutorialsNotification$: Observable<boolean> = this.payloadService.payload$.pipe(
    map((payload: Payload) => payload.viewedTutorialsNotification)
  );

  readonly viewedDataConnectionTutorials$: Observable<boolean> = this.payloadService.payload$.pipe(
    map((payload: Payload) => payload.viewedDataConnectionTutorials)
  );

  readonly viewedDataConnectionNotification$: Observable<boolean> = this.payloadService.payload$.pipe(
    map((payload: Payload) => payload.viewedDataConnectionNotification)
  );

  readonly viewedResizeAltStick$: Observable<number> = this.payloadService.payload$.pipe(
    map((payload: Payload) => payload.viewedResizeAltStick)
  );

  constructor(private payloadService: PayloadService, private userService: UserService) {
  }

  setToken(token: string): Observable<void> {
    return this.userService.setToken(token);
  }
}
