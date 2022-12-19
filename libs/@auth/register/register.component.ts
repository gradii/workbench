/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ɵmarkDirty } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsService } from '@common/public-api';
import {
  getDeepFromObject, TRI_AUTH_OPTIONS, TriAuthResult, TriAuthService, TriAuthSocialLink
} from '@gradii/triangle/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfirmState } from '../confirm-register/confirm-register.component';
import { TemporaryProjectService } from '../temporary-project.service';

class RegisterForm {
  constructor(
    public id?: number,
    public email?: string,
    public password?: string,
    public rememberMe?: boolean,
    public terms?: boolean,
    public confirmPassword?: string,
    public announcements?: boolean,
    public fullName?: string,
    public temporaryProjectToken?: string,
    public templateViewIdToOpen?: string
  ) {
  }
}

@Component({
  selector       : 'puff-register',
  templateUrl    : './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit, OnDestroy {
  user: RegisterForm                = {};
  private readonly FROM_PRICING_KEY = 'from-pricing';
  private destroy$                  = new Subject<void>();

  redirectDelay: number = 0;
  showMessages: any     = {};
  strategy: string      = '';

  submitted                        = false;
  errors: string[]                 = [];
  messages: string[]               = [];
  socialLinks: TriAuthSocialLink[] = [];

  constructor(
    protected service: TriAuthService,
    @Inject(TRI_AUTH_OPTIONS) protected options = {},
    protected router: Router,
    private activedRoute: ActivatedRoute,
    private analytics: AnalyticsService,
    private temporaryProjectService: TemporaryProjectService
  ) {
    // super(service, options, cd, router);

    this.redirectDelay = this.getConfigValue('forms.register.redirectDelay');
    this.showMessages  = this.getConfigValue('forms.register.showMessages');
    this.strategy      = this.getConfigValue('forms.register.strategy');
    this.socialLinks   = this.getConfigValue('forms.login.socialLinks');
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  register(): void {
    this.errors    = this.messages = [];
    this.submitted = true;

    this.setTemporaryProjectToken();
    this.setTemplateViewIdToOpen();

    this.service
      .register(this.strategy, this.user)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: TriAuthResult) => {
        // this.logSignUpToAnalytics(result.getResponse(), this.strategy);

        const ref = this.activedRoute.snapshot.queryParams.ref;
        if (ref && ref.startsWith('pricing_80')) {
          window.localStorage.setItem(this.FROM_PRICING_KEY, 'true');
        }

        this.submitted = false;

        if (result.isSuccess()) {
          this.messages = result.getMessages();
        } else {
          this.errors = result.getErrors();
        }

        this.temporaryProjectService.setViewIdToOpen(result.getResponse().body);

        const redirect = result.getRedirect();
        if (redirect) {
          this.router.navigateByUrl(redirect);
          return;
        }
        ɵmarkDirty(this);
      });
  }

  authGoogle() {
    this.service.authenticate('google').pipe(takeUntil(this.destroy$)).subscribe();
  }

  onConfirmChange(confirmState: ConfirmState) {
    this.user = { ...this.user, ...confirmState };
  }

  private setTemporaryProjectToken() {
    this.user.temporaryProjectToken = this.temporaryProjectService.getTemporaryProjectToken();
  }

  private setTemplateViewIdToOpen() {
    this.user.templateViewIdToOpen = this.temporaryProjectService.getTemplateViewIdToOpen();
  }

  get loginQueryParams() {
    const temporaryProjectToken = this.temporaryProjectService.getTemporaryProjectToken();
    if (temporaryProjectToken) {
      return { temporaryProjectToken };
    }
    const templateViewIdToOpen = this.temporaryProjectService.getTemplateViewIdToOpen();
    if (templateViewIdToOpen) {
      return { templateViewIdToOpen };
    }
    return {};
  }

  // private logSignUpToAnalytics(res: HttpResponseBase, type: string) {
  //   const emailsAllowed = !!this.user.announcements;
  //   this.analytics.logSignUp(emailsAllowed, res, type);
  // }


  ngOnInit(): void {
    this.temporaryProjectService.setTemporaryProjectToken(
      this.activedRoute.snapshot.queryParams.temporaryProjectToken);
    this.temporaryProjectService.setTemplateViewIdToOpen(
      this.activedRoute.snapshot.queryParams.templateViewIdToOpen);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
