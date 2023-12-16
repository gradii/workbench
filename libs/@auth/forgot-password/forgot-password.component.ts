import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, NbRequestPasswordComponent } from '@nebular/auth';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'ub-forgot-password',
  templateUrl: './forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent extends NbRequestPasswordComponent {
  requestedSuccessfully = false;

  @ViewChild('form') form: NgForm;

  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router
  ) {
    super(service, options, cd, router);
  }

  resend() {
    this.requestedSuccessfully = false;
  }

  requestPass(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service.requestPassword(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;

      if (result.isSuccess()) {
        this.messages = result.getMessages();
        this.requestedSuccessfully = true;
      } else {
        this.errors = result.getErrors();
      }

      this.cd.markForCheck();
    });
  }
}
