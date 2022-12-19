import { ProfileActions } from '@account-state/profile/profile.actions';
import { Profile } from '@account-state/profile/profile.model';
import { ProfileService } from '@account-state/profile/profile.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect, ofType } from '@ngneat/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class ProfileEffects {
  loadProfile$ = createEffect((actions) =>
    actions.pipe(
      ofType(ProfileActions.LoadProfile),
      mergeMap(() =>
        this.profileService.get().pipe(
          map((profile: Profile) => ProfileActions.LoadProfileSuccess(profile)),
          catchError(() => of(ProfileActions.LoadProfileFailed()))
        )
      )
    )
  );

  updateProfile$ = createEffect((actions) =>
    actions.pipe(
      ofType(ProfileActions.UpdateProfile),
      mergeMap(({ profile }) =>
        this.profileService.update(profile).pipe(
          map((updatedProfile: Profile) => ProfileActions.UpdateProfileSuccess(updatedProfile)),
          catchError((error: HttpErrorResponse) => {
            return of(ProfileActions.UpdateProfileFailed(error));
          })
        )
      )
    )
  );

  constructor(
    private profileService: ProfileService
  ) {
  }
}
