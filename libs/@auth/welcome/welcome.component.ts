import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbAuthOAuth2JWTToken, NbAuthService } from '@nebular/auth';
import { containsNoMoreNChars, getConfigValue, AnalyticsService } from '@common';

import { UserService } from '../user.service';
import { TemporaryProjectService } from '../temporary-project.service';
import { TutorialService } from '@shared/tutorial/tutorial.service';

@Component({
  selector: 'ub-welcome',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  user: FormGroup = this.fb.group({
    fullName: ['', containsNoMoreNChars(getConfigValue('profile.name.maxLength'))],
    companySize: [''],
    companyIndustry: [''],
    problemToSolve: [''],
    description: [''],
    solution: [''],
    role: ['']
  });

  submitted = false;
  private destroyed$ = new Subject();

  constructor(
    private temporaryProjectService: TemporaryProjectService,
    private userService: UserService,
    private authService: NbAuthService,
    protected router: Router,
    private tutorialService: TutorialService,
    private analytics: AnalyticsService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.authService
      .onTokenChange()
      .pipe(
        filter(item => item instanceof NbAuthOAuth2JWTToken && item.getOwnerStrategyName() !== 'google'),
        takeUntil(this.destroyed$)
      )
      .subscribe((token: NbAuthOAuth2JWTToken) => {
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

    // TODO this shit if for form-builder
    if (this.temporaryProjectService.viewIdToOpen) {
      this.temporaryProjectService.naviagateToProject();
    } else {
      this.userService.saveViewedOnboarding();
      this.tutorialService.startStartYourJourneyTutorial();
    }
  }
}
