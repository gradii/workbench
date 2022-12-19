import { ProfileActions } from '@account-state/profile/profile.actions';
import { Profile } from '@account-state/profile/profile.model';
import {
  selectEmailChanged, selectProfile, selectProfileLoading, selectProfileLoadingFailed, selectProfileUpdateFailed,
  selectProfileUpdating
} from '@account-state/profile/profile.selectors';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dispatch } from '@ngneat/effects';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class ProfileFacade {
  profile$: Observable<Profile> = selectProfile.pipe(
    filter(p => !!p)
  );

  profileLoading$: Observable<boolean> = selectProfileLoading

  profileLoadingFailed$: Observable<boolean> = selectProfileLoadingFailed

  profileUpdateFailed$: Observable<HttpErrorResponse> = selectProfileUpdateFailed

  profileUpdating$: Observable<boolean> = selectProfileUpdating

  emailChanged$: Observable<boolean> = selectEmailChanged

  constructor() {
  }

  load() {
    dispatch(ProfileActions.LoadProfile());
  }

  update(profile: Profile) {
    dispatch(ProfileActions.UpdateProfile(profile));
  }
}
