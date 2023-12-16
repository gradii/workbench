import { Injectable } from '@angular/core';
import { NbAuthOAuth2JWTToken, NbAuthService } from '@nebular/auth';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { Plan } from '@account-state/billing/billing.service';
import { Coupon } from '@shared/redeem-coupon/coupon';

export interface Payload {
  email: string;
  plan: Plan;
  subscriptionStatus: string;
  admin: boolean;
  featureAmplify: boolean;
  coupon: Coupon;
  viewedDemo: boolean;
  createdAt: Date;
  viewedResponsiveStyleNotification: boolean;
  viewedOnboarding: boolean;
  viewedTutorialsNotification: boolean;
  viewedResizeAltStick: number;
  viewedDataConnectionTutorials: boolean;
  viewedDataConnectionNotification: boolean;
}

interface TokenPayload {
  sub: string;
  plan: Plan;
  subscriptionStatus: string;
  admin: boolean;
  featureAmplify: boolean;
  coupon: Coupon;
  viewedDemo: boolean;
  createdAt: number;
  viewedResponsiveStyleNotification: boolean;
  viewedOnboarding: boolean;
  viewedTutorialsNotification: boolean;
  viewedResizeAltStick: number;
  viewedDataConnectionTutorials: boolean;
  viewedDataConnectionNotification: boolean;
}

@Injectable({ providedIn: 'root' })
export class PayloadService {
  private payload = new BehaviorSubject({});
  readonly payload$: Observable<Payload> = this.payload.asObservable().pipe(
    // Nebular Auth fires token onTokenChange event even if user isn't logged in.
    // In that case token will be mocked as a NbSimpleToken
    // That's why we need to verify that we have appropriate token stored by Nebular Auth.
    filter(token => token instanceof NbAuthOAuth2JWTToken),
    map((token: NbAuthOAuth2JWTToken) => {
      const payload: TokenPayload = token.getAccessTokenPayload();
      return this.toPayload(payload);
    }),
    // TODO remove on next release
    mergeMap((payload: Payload) => {
      if (!payload.plan || !payload.subscriptionStatus) {
        return this.authService.logout('email').pipe(map(() => payload));
      }

      return of(payload);
    })
  );

  constructor(private authService: NbAuthService) {
    this.authService.onTokenChange().subscribe((token: NbAuthOAuth2JWTToken) => this.payload.next(token));
  }

  private toPayload(tokenPayload: TokenPayload): Payload {
    return {
      email: tokenPayload.sub,
      plan: tokenPayload.plan,
      subscriptionStatus: tokenPayload.subscriptionStatus,
      admin: tokenPayload.admin,
      featureAmplify: tokenPayload.featureAmplify,
      coupon: tokenPayload.coupon,
      viewedDemo: tokenPayload.viewedDemo,
      createdAt: new Date(tokenPayload.createdAt),
      viewedResponsiveStyleNotification: tokenPayload.viewedResponsiveStyleNotification,
      viewedOnboarding: tokenPayload.viewedOnboarding,
      viewedTutorialsNotification: tokenPayload.viewedTutorialsNotification,
      viewedResizeAltStick: tokenPayload.viewedResizeAltStick,
      viewedDataConnectionTutorials: tokenPayload.viewedDataConnectionTutorials,
      viewedDataConnectionNotification: tokenPayload.viewedDataConnectionNotification
    };
  }
}
