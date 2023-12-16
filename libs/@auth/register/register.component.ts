import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HttpResponseBase } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, NbRegisterComponent } from '@nebular/auth';
import { NB_WINDOW } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnalyticsService } from '@common';

import { ConfirmState } from '../confirm-register/confirm-register.component';
import { TemporaryProjectService } from '../temporary-project.service';

// TODO extend nebular user when it will be available
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
  selector: 'ub-register',
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent extends NbRegisterComponent implements OnInit, OnDestroy {
  user: RegisterForm = {};
  private readonly FROM_PRICING_KEY = 'from-pricing';
  private destroy$ = new Subject<void>();

  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private activedRoute: ActivatedRoute,
    private analytics: AnalyticsService,
    private temporaryProjectService: TemporaryProjectService,
    @Inject(NB_WINDOW) private window
  ) {
    super(service, options, cd, router);
  }

  ngOnInit(): void {
    this.temporaryProjectService.setTemporaryProjectToken(this.activedRoute.snapshot.queryParams.temporaryProjectToken);
    this.temporaryProjectService.setTemplateViewIdToOpen(this.activedRoute.snapshot.queryParams.templateViewIdToOpen);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  register(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.setTemporaryProjectToken();
    this.setTemplateViewIdToOpen();

    this.service
      .register(this.strategy, this.user)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: NbAuthResult) => {
        this.logSignUpToAnalytics(result.getResponse(), this.strategy);

        // TODO: this should be better done using state
        // TODO: we should better check it the other way
        const ref = this.activedRoute.snapshot.queryParams.ref;
        if (ref && ref.startsWith('pricing_80')) {
          this.window.localStorage.setItem(this.FROM_PRICING_KEY, true);
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
          return this.router.navigateByUrl(redirect);
        }
        this.cd.detectChanges();
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

  private logSignUpToAnalytics(res: HttpResponseBase, type: string) {
    const emailsAllowed = !!this.user.announcements;
    this.analytics.logSignUp(emailsAllowed, res, type);
  }
}
