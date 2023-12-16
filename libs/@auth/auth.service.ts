import { Inject, Injectable } from '@angular/core';
import { NB_AUTH_STRATEGIES, NbAuthService, NbAuthToken, NbTokenService } from '@nebular/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { isGoogleToken } from './auth-strategy.service';

@Injectable()
export class UbAuthService extends NbAuthService {
  constructor(protected tokenService: NbTokenService, @Inject(NB_AUTH_STRATEGIES) protected strategies: any) {
    super(tokenService, strategies);
  }

  // Override this method in following case:
  // We use Google `Implicit Flow` Auth so we have no ability to get refresh token.
  // When user clicks auth by Google, `access_token` sets in local storage and if
  // user doesn't complete auth by confirming rules, this google `access_token`
  // remains in local storage. So when this user next time will go to bakery,
  // auth will try to refresh this google `access_token` as `jwt` so we will have error
  isAuthenticatedOrRefresh(): Observable<boolean> {
    return this.getToken().pipe(
      switchMap(token => {
        if (!isGoogleToken(token) && token.getValue() && !token.isValid()) {
          return this.refresh(token);
        } else {
          return of(token.isValid());
        }
      })
    );
  }

  private refresh(token: NbAuthToken): Observable<boolean> {
    return this.refreshToken(token.getOwnerStrategyName(), token).pipe(
      switchMap(res => {
        if (res.isSuccess()) {
          return this.isAuthenticated();
        } else {
          return of(false);
        }
      })
    );
  }
}
