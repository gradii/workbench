import { ActionReducerMap } from '@ngrx/store';

import { fromTemplate } from '@account-state/template/template.reducer';
import { fromProfile } from '@account-state/profile/profile.reducer';
import { fromBilling } from '@account-state/billing/billing.reducer';

export namespace fromAccount {
  export interface State {
    profile: fromProfile.State;
    billing: fromBilling.State;
    template: fromTemplate.State;
  }

  export const reducers: ActionReducerMap<State> = {
    profile: fromProfile.reducer,
    billing: fromBilling.reducer,
    template: fromTemplate.reducer
  };
}
