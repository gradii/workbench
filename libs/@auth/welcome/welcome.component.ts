import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AnalyticsService, containsNoMoreNChars, getConfigValue } from '@common/public-api';
import { TriAuthOAuth2JWTToken, TriAuthService } from '@gradii/triangle/auth';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TemporaryProjectService } from '../temporary-project.service';

import { UserService } from '../user.service';

// import { TutorialService } from '@shared/tutorial/tutorial.service';

@Component({
  selector: 'ub-welcome',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  user: UntypedFormGroup = this.fb.group({
    fullName: ['', containsNoMoreNChars(getConfigValue('profile.name.maxLength'))],
    companySize: [''],
    companyIndustry: [''],
    problemToSolve: [''],
    description: [''],
    solution: [''],
    role: ['']
  });

  submitted = false;
  private destroyed$ = new Subject<void>();

  constructor(
    private temporaryProjectService: TemporaryProjectService,
    private userService: UserService,
    private authService: TriAuthService,
    protected router: Router,
    // private tutorialService: TutorialService,
    private analytics: AnalyticsService,
    private fb: UntypedFormBuilder
  ) {
  }

  ngOnInit(): void {
    this.authService
      .onTokenChange()
      .pipe(
        filter(item => item instanceof TriAuthOAuth2JWTToken && item.getOwnerStrategyName() !== 'google'),
        takeUntil(this.destroyed$)
      )
      .subscribe((token: TriAuthOAuth2JWTToken) => {
        this.user.get('fullName').setValue(token.getAccessTokenPayload().fullName);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  get fullName(): AbstractControl {
    return this.user && this.user.controls['fullName'];
  }

  updateUser(): void {
    this.submitted = true;

    this.userService.saveInitialUserInfo(this.user.value).subscribe(
      () => {
        this.submitted = false;
        this.navigate();
      },
      () => (this.submitted = false)
    );
  }

  navigate(): void {
    this.analytics.logWelcome(this.user.value);

    // if (this.temporaryProjectService.viewIdToOpen) {
      this.temporaryProjectService.naviagateToProject();
    // } else {
    //   this.userService.saveViewedOnboarding();
      // this.tutorialService.startStartYourJourneyTutorial();
    // }
  }
}
