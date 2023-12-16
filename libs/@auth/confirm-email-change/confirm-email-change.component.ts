import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, NbTokenService } from '@nebular/auth';
import { ActivatedRoute } from '@angular/router';
import { finalize, map, mergeMap } from 'rxjs/operators';

import { UserService } from '../user.service';
import { UbAuthStrategy } from '../auth-strategy.service';

@Component({
  selector: 'ub-confirm-email-change',
  templateUrl: './confirm-email-change.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmEmailChangeComponent implements OnInit {
  loading = false;
  token: string;
  isTokenExpired: boolean;
  messages: string[] = [];
  errors: string[] = [];

  get hasErrors(): boolean {
    return !this.token || this.isTokenExpired || !!this.errors.length;
  }

  constructor(
    protected route: ActivatedRoute,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    private userService: UserService,
    private authService: NbAuthService,
    private tokenService: NbTokenService,
    private strategy: UbAuthStrategy,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    const encodedToken = this.route.snapshot.queryParamMap.get('token');
    if (!encodedToken) {
      return;
    }

    const decodedToken = JSON.parse(atob(encodedToken));

    this.token = decodedToken.token;
    this.isTokenExpired = new Date() > decodedToken.expiresIn;

    if (this.token && !this.isTokenExpired) {
      this.confirmEmailChange();
    }
  }

  private confirmEmailChange() {
    this.loading = true;
    this.messages = [];
    this.errors = [];
    this.userService
      .confirmEmailChange(this.token)
      .pipe(
        map(token => {
          return new NbAuthResult(true, token, '', [], '', this.strategy.createToken(token, true));
        }),
        mergeMap((result: NbAuthResult) => {
          if (result.isSuccess() && result.getToken()) {
            return this.tokenService.set(result.getToken());
          }
        }),
        finalize(() => {
          this.loading = false;
          this.cd.markForCheck();
        })
      )
      .subscribe(
        () => (this.messages = ['Email updated successfully!']),
        () => (this.errors = ['Email change request expired or invalid!'])
      );
  }
}
