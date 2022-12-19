import { Injectable } from '@angular/core';
import { TriAuthOAuth2JWTToken, TriAuthService } from '@gradii/triangle/auth';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Plan } from '@account-state/billing/billing.service';
import { Coupon } from '@shared/redeem-coupon/coupon';

export interface Payload {
  plan: Plan;
  accountName: string;
  realName: string;
  email: string;
  subscriptionStatus: string;
  admin: boolean;
  role: number;
  permissionCodes: string[],
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
  plan: Plan;
  sub: string;
  subscriptionStatus: string;
  accountName: string;
  realName: string;
  admin: boolean;
  /**
   * @deprecated use permissionCodes instead
   */
  role: number;
  permissionCodes: string[];
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
    filter(token => token instanceof TriAuthOAuth2JWTToken),
    map((token: TriAuthOAuth2JWTToken) => {
      const payload: TokenPayload = token.getAccessTokenPayload();
      return this.toPayload(payload);
    }),
    // // TODO remove on next release
    // mergeMap((payload: Payload) => {
    //   if (!payload.plan || !payload.subscriptionStatus) {
    //     return this.authService.logout('email').pipe(map(() => payload));
    //   }
    //
    //   return of(payload);
    // })
  );

  constructor(private authService: TriAuthService) {
    this.authService.onTokenChange().subscribe((token: TriAuthOAuth2JWTToken) => this.payload.next(token));
  }

  private toPayload(tokenPayload: TokenPayload): Payload {
    return {
      plan: tokenPayload.plan,
      email: tokenPayload.sub,
      subscriptionStatus: tokenPayload.subscriptionStatus,
      accountName: tokenPayload.accountName,
      realName: tokenPayload.realName,
      admin: tokenPayload.admin,
      role: tokenPayload.role,
      permissionCodes: tokenPayload.permissionCodes,
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
