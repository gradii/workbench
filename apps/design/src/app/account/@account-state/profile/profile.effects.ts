import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ProfileActions } from '@account-state/profile/profile.actions';
import { ProfileService } from '@account-state/profile/profile.service';
import { Profile } from '@account-state/profile/profile.model';
import { Store } from '@ngrx/store';
import { fromProfile } from '@account-state/profile/profile.reducer';

@Injectable()
export class ProfileEffects {
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.ActionTypes.LoadProfile),
      mergeMap(() =>
        this.profileService.get().pipe(
          map((profile: Profile) => ProfileActions.loadProfileSuccess({ profile })),
          catchError(() => of(ProfileActions.loadProfileFailed()))
        )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.ActionTypes.UpdateProfile),
      mergeMap(({ profile }) =>
        this.profileService.update(profile).pipe(
          map((updatedProfile: Profile) => ProfileActions.updateProfileSuccess({ profile: updatedProfile })),
          catchError((error: HttpErrorResponse) => {
            return of(ProfileActions.updateProfileFailed({ error: error }));
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromProfile.State>,
    private profileService: ProfileService
  ) {
  }
}
