import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { Profile } from '@account-state/profile/profile.model';

export namespace ProfileActions {
  export enum ActionTypes {
    LoadProfile = '[Profile] Load Profile',
    LoadProfileSuccess = '[Profile] Load Profile Success',
    LoadProfileFailed = '[Profile] Load Profile Failed',

    UpdateProfile = '[Profile] Update Profile',
    UpdateProfileSuccess = '[Profile] Update Profile Success',
    UpdateProfileFailed = '[Profile] Update Profile Failed',
  }

  export const loadProfile = createAction(ActionTypes.LoadProfile);
  export const loadProfileSuccess = createAction(ActionTypes.LoadProfileSuccess, props<{ profile: Profile }>());
  export const loadProfileFailed = createAction(ActionTypes.LoadProfileFailed);

  export const updateProfile = createAction(ActionTypes.UpdateProfile, props<{ profile: Profile }>());
  export const updateProfileSuccess = createAction(ActionTypes.UpdateProfileSuccess, props<{ profile: Profile }>());
  export const updateProfileFailed = createAction(
    ActionTypes.UpdateProfileFailed,
    props<{ error: HttpErrorResponse }>()
  );
}
