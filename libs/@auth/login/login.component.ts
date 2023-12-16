import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NB_AUTH_OPTIONS, NbAuthResult, NbAuthService, NbLoginComponent } from '@nebular/auth';
import { AnalyticsService } from '@common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TemporaryProjectService } from '../temporary-project.service';

@Component({
  selector: 'ub-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends NbLoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private analytics: AnalyticsService,
    private activatedRoute: ActivatedRoute,
    private temporaryProjectService: TemporaryProjectService,
    service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) options = {},
    cd: ChangeDetectorRef,
    router: Router
  ) {
    super(service, options, cd, router);
  }

  ngOnInit(): void {
    this.temporaryProjectService.setTemporaryProjectToken(
      this.activatedRoute.snapshot.queryParams.temporaryProjectToken
    );
    this.temporaryProjectService.setTemplateViewIdToOpen(this.activatedRoute.snapshot.queryParams.templateViewIdToOpen);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.setTemporaryProjectToken();
    this.setTemplateViewIdToOpen();

    this.service
      .authenticate(this.strategy, this.user)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: NbAuthResult) => {
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
        this.cd.detectChanges();
      });
  }

  authGoogle() {
    this.service.authenticate('google').pipe(takeUntil(this.destroy$)).subscribe();
  }

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
