/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild, ɵmarkDirty } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getDeepFromObject, TRI_AUTH_OPTIONS, TriAuthResult, TriAuthService } from '@gradii/triangle/auth';

@Component({
  selector       : 'ub-reset-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl    : './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

  redirectDelay: number = 0;
  showMessages: any     = {};
  strategy: string      = '';

  submitted          = false;
  errors: string[]   = [];
  messages: string[] = [];
  user: any          = {};


  @ViewChild('form') form: NgForm;
  // private token: string;
  private isTokenExpired: boolean;

  constructor(
    protected service: TriAuthService,
    @Inject(TRI_AUTH_OPTIONS) protected options = {},
    protected router: Router,
    protected route: ActivatedRoute,
    @Inject(HTTP_INTERCEPTORS) private httpInterceptor: any[]
  ) {

    this.redirectDelay = this.getConfigValue('forms.resetPassword.redirectDelay');
    this.showMessages  = this.getConfigValue('forms.resetPassword.showMessages');
    this.strategy      = this.getConfigValue('forms.resetPassword.strategy');

    console.log(httpInterceptor);
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  ngOnInit() {
    // const encodedToken = this.route.snapshot.queryParamMap.get('token');
    // const decodedToken = JSON.parse(atob(encodedToken));
    //
    // this.token = decodedToken.token;
  }

  resetPass(): void {
    this.errors        = this.messages = [];
    this.submitted     = true;
    const resetRequest = this.createResetPasswordRequest();

    this.service.resetPassword(this.strategy, resetRequest).subscribe((result: TriAuthResult) => {
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = ['Password updated successfully!'];
      } else {
        this.errors = ['Something went wrong!'];
      }

      const redirect = result.getRedirect();
      if (redirect) {
        this.router.navigateByUrl(redirect);
        return;
      }
      ɵmarkDirty(this);
    });
  }

  private createResetPasswordRequest() {
    return { ...this.user /*token: this.token*/ };
  }
}
