import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, NbResetPasswordComponent } from '@nebular/auth';

@Component({
  selector: 'ub-reset-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent extends NbResetPasswordComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  private token: string;
  private isTokenExpired: boolean;

  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(service, options, cd, router);
  }

  ngOnInit() {
    const encodedToken = this.route.snapshot.queryParamMap.get('token');
    const decodedToken = JSON.parse(atob(encodedToken));

    this.token = decodedToken.token;
  }

  resetPass(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    const resetRequest = this.createResetPasswordRequest();

    this.service.resetPassword(this.strategy, resetRequest).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = ['Password updated successfully!'];
      } else {
        this.errors = ['Something went wrong!'];
      }

      const redirect = result.getRedirect();
      if (redirect) {
        return this.router.navigateByUrl(redirect);
      }
      this.cd.detectChanges();
    });
  }

  private createResetPasswordRequest() {
    return { ...this.user, token: this.token };
  }
}
