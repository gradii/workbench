import { fromProfile } from '@account-state/profile/profile.reducer';
import { select } from '@ngneat/elf';

export const selectProfileState = fromProfile.fromProfileStore;

export const selectProfile = selectProfileState.pipe(select((state: fromProfile.State) => state.profile));

export const selectProfileLoading        = selectProfileState.pipe(select((state: fromProfile.State) => state.loading));
export const selectProfileLoadingFailed  = selectProfileState.pipe(select((state: fromProfile.State) => state.failed));
export const selectProfileLoadingSuccess = selectProfileState.pipe(select((state: fromProfile.State) => !state.failed));

export const selectProfileUpdating      = selectProfileState.pipe(select((state: fromProfile.State) => state.updating));
export const selectProfileUpdateFailed  = selectProfileState.pipe(select((state: fromProfile.State) => state.error));
export const selectProfileUpdateSuccess = selectProfileState.pipe(
  select((state: fromProfile.State) => !state.updateFailed));

export const selectEmailChanged = selectProfileState.pipe(select((state: fromProfile.State) => state.emailChanged));
