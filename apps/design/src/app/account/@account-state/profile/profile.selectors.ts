import { createSelector } from '@ngrx/store';

import { getAccountState } from '@account-state/account.selector';
import { fromAccount } from '@account-state/account.reducer';
import { fromProfile } from '@account-state/profile/profile.reducer';

export const selectProfileState = createSelector(getAccountState, (state: fromAccount.State) => state.profile);

export const selectProfile = createSelector(selectProfileState, (state: fromProfile.State) => state.profile);

export const selectProfileLoading = createSelector(selectProfileState, (state: fromProfile.State) => state.loading);
export const selectProfileLoadingFailed = createSelector(
  selectProfileState,
  (state: fromProfile.State) => state.failed
);
export const selectProfileLoadingSuccess = createSelector(
  selectProfileState,
  (state: fromProfile.State) => !state.failed
);

export const selectProfileUpdating = createSelector(selectProfileState, (state: fromProfile.State) => state.updating);
export const selectProfileUpdateFailed = createSelector(selectProfileState, (state: fromProfile.State) => state.error);
export const selectProfileUpdateSuccess = createSelector(
  selectProfileState,
  (state: fromProfile.State) => !state.updateFailed
);

export const selectEmailChanged = createSelector(selectProfileState, (state: fromProfile.State) => state.emailChanged);
