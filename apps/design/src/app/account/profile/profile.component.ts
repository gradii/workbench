import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { containsNoMoreNChars, getConfigValue } from '@common';

import { Profile } from '@account-state/profile/profile.model';
import { ProfileFacade } from '@account-state/profile/profile.facade';

@Component({
  selector: 'ub-profile',
  styleUrls: ['./profile.component.scss'],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: FormGroup = this.fb.group({
    name: ['', [Validators.required, containsNoMoreNChars(getConfigValue('profile.name.maxLength'))]],
    email: [''],
    company: ['', containsNoMoreNChars(getConfigValue('profile.company.maxLength'))],
    role: ['', containsNoMoreNChars(getConfigValue('profile.company.maxLength'))]
  });

  closeLoadingFailedAlert$ = new Subject<boolean>();

  closeUpdateFailedAlert$ = new Subject<boolean>();

  closeEmailChangeRequestedAlert$ = new Subject<boolean>();

  profileLoadingFailed$: Observable<boolean> = this.profileFacade.profileLoadingFailed$;

  profileUpdateFailed$: Observable<HttpErrorResponse> = this.profileFacade.profileUpdateFailed$;

  showCantLoadAlert$: Observable<boolean> = merge(this.profileLoadingFailed$, this.closeLoadingFailedAlert$);

  showCantUpdateAlert$: Observable<boolean | HttpErrorResponse> = merge(
    this.profileUpdateFailed$,
    this.closeUpdateFailedAlert$
  );

  showEmailChangeRequestedAlert$: Observable<boolean> = merge(
    this.profileFacade.emailChanged$,
    this.closeEmailChangeRequestedAlert$
  );

  showLoader$: Observable<boolean> = combineLatest([
    this.profileFacade.profileLoading$,
    this.profileFacade.profileUpdating$
  ]).pipe(map(([loading, updating]) => loading || updating));

  formDisabled$: Observable<boolean> = combineLatest([this.showLoader$, this.profileLoadingFailed$]).pipe(
    map(([loading, failed]) => loading || failed)
  );

  private destroyed$ = new Subject();

  constructor(private fb: FormBuilder, private profileFacade: ProfileFacade) {
  }

  get email(): AbstractControl {
    return this.user && this.user.controls['email'];
  }

  get name(): AbstractControl {
    return this.user && this.user.controls['name'];
  }

  get company(): AbstractControl {
    return this.user && this.user.controls['company'];
  }

  get role(): AbstractControl {
    return this.user && this.user.controls['role'];
  }

  ngOnInit() {
    this.profileFacade.profile$.pipe(takeUntil(this.destroyed$)).subscribe((profile: Profile) => {
      this.user.patchValue(profile);
    });
  }

  save() {
    this.profileFacade.update(this.user.value);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
