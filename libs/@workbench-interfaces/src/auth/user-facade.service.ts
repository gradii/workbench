import { Observable } from 'rxjs';

import { Plan } from '@account-state/billing/billing.service';
import { Coupon } from '@shared/redeem-coupon/coupon';

export interface UserFacade {
  readonly email$: Observable<string>

  readonly plan$: Observable<Plan>

  readonly subscriptionStatus$: Observable<string>

  readonly admin$: Observable<boolean>

  readonly featureAmplify$: Observable<boolean>

  readonly coupon$: Observable<Coupon>

  readonly createdAt$: Observable<Date>

  readonly viewedResponsiveStyleNotification$: Observable<boolean>

  readonly viewedOnboarding$: Observable<boolean>

  readonly viewedTutorialsNotification$: Observable<boolean>

  readonly viewedDataConnectionTutorials$: Observable<boolean>

  readonly viewedDataConnectionNotification$: Observable<boolean>

  readonly viewedResizeAltStick$: Observable<number>
}
