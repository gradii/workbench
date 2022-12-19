import { ChangeDetectionStrategy, Component, Inject, ViewChild, ɵmarkDirty } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { getDeepFromObject, TRI_AUTH_OPTIONS, TriAuthResult, TriAuthService } from '@gradii/triangle/auth';

@Component({
  selector       : 'ub-forgot-password',
  templateUrl    : './forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
  requestedSuccessfully = false;

  redirectDelay: number = 0;
  showMessages: any     = {};
  strategy: string      = '';

  submitted          = false;
  errors: string[]   = [];
  messages: string[] = [];
  user: any          = {};

  @ViewChild('form') form: NgForm;

  constructor(
    protected service: TriAuthService,
    @Inject(TRI_AUTH_OPTIONS) protected options = {},
    protected router: Router
  ) {
    this.redirectDelay = this.getConfigValue('forms.requestPassword.redirectDelay');
    this.showMessages  = this.getConfigValue('forms.requestPassword.showMessages');
    this.strategy      = this.getConfigValue('forms.requestPassword.strategy');
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  resend() {
    this.requestedSuccessfully = false;
  }

  requestPass(): void {
    this.errors    = this.messages = [];
    this.submitted = true;

    this.service.requestPassword(this.strategy, this.user)
      .subscribe((result: TriAuthResult) => {
        this.submitted = false;

        if (result.isSuccess()) {
          this.messages              = result.getMessages();
          this.requestedSuccessfully = true;
        } else {
          this.errors = result.getErrors();
        }

        ɵmarkDirty(this);
      });
  }
}
