import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TriAuthResult, TriAuthService, TriTokenService } from '@gradii/triangle/auth';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { environment } from '@environments';
import { InitialUserInfo, UpdateUserRequest, UserProviderToken } from './user.model';
import { UbAuthStrategy } from './auth-strategy.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private http: HttpClient,
    private strategy: UbAuthStrategy,
    private authService: TriAuthService,
    private tokenService: TriTokenService
  ) {
  }

  update(user: UpdateUserRequest): Observable<Object> {
    return this.http.put(`${environment.apiUrl}/user`, user);
  }

  saveInitialUserInfo(info: InitialUserInfo): Observable<void> {
    return this.http
      .put(`${environment.apiUrl}/user/initial-info`, info)
      .pipe(switchMap((token: string) => this.setToken(token)));
  }

  // saveViewedDemo(): Observable<void> {
  //   return this.http
  //     .put(`${environment.apiUrl}/user/viewed-demo`, { viewedDemo: true })
  //     .pipe(switchMap((token: string) => this.setToken(token)));
  // }

  // saveViewedResponsiveStylesNotification(): void {
  //   this.http
  //     .put(`${environment.apiUrl}/user/viewed-responsive-style-notification`, {
  //       viewedResponsiveStyleNotification: true
  //     })
  //     .pipe(switchMap((token: string) => this.setToken(token)))
  //     .subscribe();
  // }

  // saveTriedPaidFunctionalityMailSentNotification(): void {
  //   this.http
  //     .put(`${environment.apiUrl}/user/tried-paid-functionality-mail-sent`, { triedPaidFunctionalityMailSent: true })
  //     .pipe(switchMap((token: string) => this.setToken(token)))
  //     .subscribe();
  // }

  // saveViewedOnboarding(): void {
  //   this.http
  //     .put(`${environment.apiUrl}/user/viewed-onboarding`, { viewedOnboarding: true })
  //     .pipe(switchMap((token: string) => this.setToken(token)))
  //     .subscribe();
  // }

  // saveViewedTutorialsNotification(): Observable<void> {
  //   return this.http
  //     .put(`${environment.apiUrl}/user/viewed-tutorials-notification`, { viewedTutorialsNotification: true })
  //     .pipe(switchMap((token: string) => this.setToken(token)));
  // }

  // saveViewedDataConnectionTutorials(): Observable<void> {
  //   return this.http
  //     .put(`${environment.apiUrl}/user/viewed-data-connection-tutorials`, { viewedDataConnectionTutorials: true })
  //     .pipe(switchMap((token: string) => this.setToken(token)));
  // }

  // saveViewedDataConnectionNotification(): Observable<void> {
  //   return this.http
  //     .put(`${environment.apiUrl}/user/viewed-data-connection-notification`, { viewedDataConnectionNotification: true })
  //     .pipe(switchMap((token: string) => this.setToken(token)));
  // }

  incViewedResizeAltStick(): Observable<void> {
    return this.http
      .get(`${environment.apiUrl}/user/viewed-resize-alt-stick`)
      .pipe(switchMap((token: string) => this.setToken(token)));
  }

  confirmEmailChange(token: string): Observable<Object> {
    return this.http.get(`${environment.apiUrl}/user/confirm-email-change`, { params: { token } });
  }

  setToken(token: string): Observable<void> {
    const res: TriAuthResult = new TriAuthResult(true, token, '', [], '', this.strategy.createToken(token, true));

    return this.tokenService.set(res.getToken());
  }

  hasGoogleUser(data: UserProviderToken): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/auth/has-google-user`, data);
  }
}
