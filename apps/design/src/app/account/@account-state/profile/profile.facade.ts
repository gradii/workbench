import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { fromProfile } from '@account-state/profile/profile.reducer';
import { ProfileActions } from '@account-state/profile/profile.actions';
import { Profile } from '@account-state/profile/profile.model';
import {
  selectEmailChanged,
  selectProfile,
  selectProfileLoading,
  selectProfileLoadingFailed,
  selectProfileUpdateFailed,
  selectProfileUpdating
} from '@account-state/profile/profile.selectors';

@Injectable()
export class ProfileFacade {
  profile$: Observable<Profile> = this.store.pipe(
    select(selectProfile),
    filter(p => !!p)
  );

  profileLoading$: Observable<boolean> = this.store.pipe(select(selectProfileLoading));

  profileLoadingFailed$: Observable<boolean> = this.store.pipe(select(selectProfileLoadingFailed));

  profileUpdateFailed$: Observable<HttpErrorResponse> = this.store.pipe(select(selectProfileUpdateFailed));

  profileUpdating$: Observable<boolean> = this.store.pipe(select(selectProfileUpdating));

  emailChanged$: Observable<boolean> = this.store.pipe(select(selectEmailChanged));

  constructor(private store: Store<fromProfile.State>) {
  }

  load() {
    this.store.dispatch(ProfileActions.loadProfile());
  }

  update(profile: Profile) {
    this.store.dispatch(ProfileActions.updateProfile({ profile }));
  }
}
