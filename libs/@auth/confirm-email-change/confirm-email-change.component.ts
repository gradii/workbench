import { ChangeDetectionStrategy, ɵmarkDirty, Component, Inject, OnInit } from '@angular/core';
import { TRI_AUTH_OPTIONS, TriAuthResult, TriAuthService, TriTokenService } from '@gradii/triangle/auth';
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
    @Inject(TRI_AUTH_OPTIONS) protected options = {},
    private userService: UserService,
    private authService: TriAuthService,
    private tokenService: TriTokenService,
    private strategy: UbAuthStrategy,
    
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
          return new TriAuthResult(true, token, '', [], '', this.strategy.createToken(token, true));
        }),
        mergeMap((result: TriAuthResult) => {
          if (result.isSuccess() && result.getToken()) {
            return this.tokenService.set(result.getToken());
          }
        }),
        finalize(() => {
          this.loading = false;
          ɵmarkDirty(this);
        })
      )
      .subscribe(
        () => (this.messages = ['Email updated successfully!']),
        () => (this.errors = ['Email change request expired or invalid!'])
      );
  }
}
