import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { NbAuthResult, NbAuthService } from '@nebular/auth';

import { UserService } from '../user.service';
import { UserProviderToken } from '../user.model';
import { ConfirmState } from '../confirm-register/confirm-register.component';
import { AnalyticsService } from '@common';

enum State {
  LOADING,
  CONFIRM,
  ERROR,
}

@Component({
  selector: 'ub-oauth2-callback',
  templateUrl: './oauth2-callback.component.html',
  styleUrls: ['./oauth2-callback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OAuth2CallbackComponent implements OnDestroy, OnInit {
  @ViewChild('form') form: NgForm;

  loading: boolean;
  error: boolean;
  componentStates = State;
  state: State;
  confirmSubmitted = false;
  private authResult: NbAuthResult;
  private data: ConfirmState = {};
  private destroy$ = new Subject<void>();

  constructor(
    private authService: NbAuthService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    private analytics: AnalyticsService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.state = State.LOADING;

    this.authService
      .authenticate('google')
      .pipe(
        switchMap((authResult: NbAuthResult) => {
          if (authResult.isSuccess() && authResult.getRedirect()) {
            this.authResult = authResult;
            return this.handleAuthentication();
          } else {
            this.state = State.ERROR;
            return of();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((result: NbAuthResult) => {
        this.analytics.logLogIn(result.getResponse(), 'google');
        this.router.navigateByUrl(result.getRedirect());
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  handleAuthentication() {
    const data: UserProviderToken = {
      token: {
        access_token: this.authResult.getToken().getValue()
      }
    };

    return this.userService.hasGoogleUser(data).pipe(
      switchMap((res: boolean) => {
        if (res) {
          return this.authService.authenticate('email', this.authResult.getToken());
        } else {
          this.state = State.CONFIRM;
          this.cd.detectChanges();
          return of();
        }
      })
    );
  }

  confirm() {
    this.confirmSubmitted = true;
    const data: UserProviderToken = {
      token: {
        access_token: this.authResult.getToken().getValue()
      },
      ownerStrategyName: 'google',
      ...this.data
    };

    this.authService
      .authenticate('email', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: NbAuthResult) => {
        this.confirmSubmitted = false;
        this.analytics.logSignUp(!!this.data.announcements, result.getResponse(), 'google');
        this.router.navigateByUrl('auth/welcome');
      });
  }

  back() {
    this.router.navigateByUrl('/');
  }

  onConfirmChange(confirmState: ConfirmState) {
    this.data = confirmState;
  }
}
