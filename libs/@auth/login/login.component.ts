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
import { TemporaryProjectService } from '../temporary-project.service';

@Component({
  selector       : 'ub-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl    : './login.component.html',
  styleUrls      : ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  redirectDelay: number = 0;
  showMessages: any     = {};
  strategy: string      = '';

  errors: string[]                 = [];
  messages: string[]               = [];
  user: any                        = {};
  submitted: boolean               = false;
  socialLinks: TriAuthSocialLink[] = [];
  rememberMe                       = false;

  private destroy$ = new Subject<void>();

  constructor(
    private analytics: AnalyticsService,
    private activatedRoute: ActivatedRoute,
    private temporaryProjectService: TemporaryProjectService,
    protected service: TriAuthService,
    @Inject(TRI_AUTH_OPTIONS)
    protected options = {},
    protected router: Router
  ) {
    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages  = this.getConfigValue('forms.login.showMessages');
    this.strategy      = this.getConfigValue('forms.login.strategy');
    this.socialLinks   = this.getConfigValue('forms.login.socialLinks');
    this.rememberMe    = this.getConfigValue('forms.login.rememberMe');
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  ngOnInit(): void {
    this.temporaryProjectService.setTemporaryProjectToken(
      this.activatedRoute.snapshot.queryParams.temporaryProjectToken
    );
    this.temporaryProjectService.setTemplateViewIdToOpen(
      this.activatedRoute.snapshot.queryParams.templateViewIdToOpen);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  login(): void {
    this.errors    = [];
    this.messages  = [];
    this.submitted = true;

    this.setTemporaryProjectToken();
    this.setTemplateViewIdToOpen();

    this.service
      .authenticate(this.strategy, this.user)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: TriAuthResult) => {
        this.analytics.logLogIn(result.getResponse(), this.strategy);

        this.submitted = false;

        if (result.isSuccess()) {
          this.messages = result.getMessages();
        } else {
          this.errors = result.getErrors();
        }

        this.temporaryProjectService.setViewIdToOpen(result.getResponse().body);

        // TODO this shit if for form-builder
        if (this.temporaryProjectService.viewIdToOpen) {
          return this.temporaryProjectService.naviagateToProject();
        }
        const redirect = result.getRedirect();
        if (redirect) {
          return this.router.navigateByUrl(redirect);
        }
        ɵmarkDirty(this);
      });
  }

  // authGoogle() {
  //   this.service.authenticate('google').pipe(takeUntil(this.destroy$)).subscribe();
  // }

  private setTemporaryProjectToken() {
    const temporaryProjectToken = this.temporaryProjectService.getTemporaryProjectToken();
    if (temporaryProjectToken) {
      this.user.temporaryProjectToken = temporaryProjectToken;
    }
  }

  private setTemplateViewIdToOpen() {
    const templateViewIdToOpen = this.temporaryProjectService.getTemplateViewIdToOpen();
    if (templateViewIdToOpen) {
      this.user.templateViewIdToOpen = templateViewIdToOpen;
    }
  }
}
