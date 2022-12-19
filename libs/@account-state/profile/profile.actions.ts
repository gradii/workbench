import { Profile } from '@account-state/profile/profile.model';
import { HttpErrorResponse } from '@angular/common/http';
import { createAction } from '@ngneat/effects';

export namespace ProfileActions {
  export enum ActionTypes {
    LoadProfile          = '[Profile] Load Profile',
    LoadProfileSuccess   = '[Profile] Load Profile Success',
    LoadProfileFailed    = '[Profile] Load Profile Failed',

    UpdateProfile        = '[Profile] Update Profile',
    UpdateProfileSuccess = '[Profile] Update Profile Success',
    UpdateProfileFailed  = '[Profile] Update Profile Failed',
  }

  export const LoadProfile        = createAction(ActionTypes.LoadProfile);
  export const LoadProfileSuccess = createAction(ActionTypes.LoadProfileSuccess, (profile: Profile) => ({ profile }));
  export const LoadProfileFailed  = createAction(ActionTypes.LoadProfileFailed);

  export const UpdateProfile        = createAction(ActionTypes.UpdateProfile, (profile: Profile) => ({ profile }));
  export const UpdateProfileSuccess = createAction(ActionTypes.UpdateProfileSuccess,
    (profile: Profile) => ({ profile }));
  export const UpdateProfileFailed  = createAction(
    ActionTypes.UpdateProfileFailed,
    (error: HttpErrorResponse) => ({ error })
  );
}
