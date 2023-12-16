import { createReducer, on } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { Profile } from '@account-state/profile/profile.model';
import { ProfileActions } from '@account-state/profile/profile.actions';

export namespace fromProfile {
  export interface State {
    profile: Profile;
    loading: boolean;
    failed: boolean;

    updating: boolean;
    updateFailed: boolean;

    emailChanged: boolean;
    error: HttpErrorResponse;
  }

  const initialState: State = {
    profile: null,
    loading: false,
    failed: false,

    updating: false,
    updateFailed: false,

    emailChanged: false,
    error: null
  };

  export const reducer = createReducer(
    initialState,
    on(ProfileActions.loadProfile, state => ({ ...state, loading: true })),
    on(ProfileActions.loadProfileSuccess, (state, action) => ({ ...state, profile: action.profile, loading: false })),
    on(ProfileActions.loadProfileFailed, state => ({ ...state, loading: false, failed: true })),

    on(ProfileActions.updateProfile, state => ({ ...state, updating: true })),
    on(ProfileActions.updateProfileSuccess, (state, action) => ({
      ...state,
      profile: action.profile,
      updating: false,
      emailChanged: state.profile.email !== action.profile.email
    })),
    on(ProfileActions.updateProfileFailed, (state, action) => ({
      ...state,
      updating: false,
      updateFailed: true,
      error: action.error
    }))
  );
}
