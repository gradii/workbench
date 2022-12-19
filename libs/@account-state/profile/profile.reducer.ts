import { ProfileActions } from '@account-state/profile/profile.actions';

import { Profile } from '@account-state/profile/profile.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import { tap } from 'rxjs/operators';

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
    failed : false,

    updating    : false,
    updateFailed: false,

    emailChanged: false,
    error       : null
  };


  const { state, config } = createState(
    withProps<State>(initialState)
  );

  export const fromProfileStore = new Store({ name: 'kitchen-profile', state, config });

  export class FromProfileReducer {
    loadProfile() {
      fromProfileStore.update((state: State) => ({
        ...state, loading: true
      }));
    }

    loadProfileSuccess(profile: Profile) {
      fromProfileStore.update((state: State) => ({
        ...state, profile: profile, loading: false
      }));
    }

    loadProfileFailed() {
      fromProfileStore.update((state: State) => ({
        ...state, loading: false, failed: true
      }));
    }

    updateProfile() {
      fromProfileStore.update((state: State) => ({
        ...state, updating: true
      }));
    }

    updateProfileSuccess(profile: Profile) {
      fromProfileStore.update((state: State) => ({
        ...state,
        profile     : profile,
        updating    : false,
        emailChanged: state.profile.email !== profile.email
      }));
    }

    updateProfileFailed(error: HttpErrorResponse) {
      fromProfileStore.update((state: State) => ({
        ...state,
        updating    : false,
        updateFailed: true,
        error       : error
      }));
    }
  }

  export class ReducerEffect {
    reducerEffect = createEffect((actions) => actions.pipe(
      tap((action) => {
        switch (action.type) {
          case ProfileActions.ActionTypes.LoadProfile:
            return fromProfile.fromProfileStore.update(state => ({ ...state, loading: true }));
          case ProfileActions.ActionTypes.LoadProfileSuccess:
            return fromProfile.fromProfileStore.update(
              state => ({ ...state, profile: action.profile, loading: false }));
          case ProfileActions.ActionTypes.LoadProfileFailed:
            return fromProfile.fromProfileStore.update(state => ({ ...state, loading: false, failed: true }));
          case ProfileActions.ActionTypes.UpdateProfile:
            return fromProfile.fromProfileStore.update(state => ({ ...state, updating: true }));
          case ProfileActions.ActionTypes.UpdateProfileSuccess:
            return fromProfile.fromProfileStore.update(state => ({
              ...state,
              profile     : action.profile,
              updating    : false,
              emailChanged: state.profile.email !== action.profile.email
            }));
          case ProfileActions.ActionTypes.UpdateProfileFailed:
            return fromProfile.fromProfileStore.update(state => ({
              ...state,
              updating    : false,
              updateFailed: true,
              error       : action.error
            }));
        }
      })
    ));
  }

  // export const reducer = createReducer(
  //   initialState,
  //   on(ProfileActions.loadProfile, state => ({ ...state, loading: true })),
  //   on(ProfileActions.loadProfileSuccess, (state, action) => ({ ...state, profile: action.profile, loading: false })),
  //   on(ProfileActions.loadProfileFailed, state => ({ ...state, loading: false, failed: true })),
  //
  //   on(ProfileActions.updateProfile, state => ({ ...state, updating: true })),
  //   on(ProfileActions.updateProfileSuccess, (state, action) => ({
  //     ...state,
  //     profile     : action.profile,
  //     updating    : false,
  //     emailChanged: state.profile.email !== action.profile.email
  //   })),
  //   on(ProfileActions.updateProfileFailed, (state, action) => ({
  //     ...state,
  //     updating    : false,
  //     updateFailed: true,
  //     error       : action.error
  //   }))
  // );
}
