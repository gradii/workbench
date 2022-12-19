import { fromBilling } from '@account-state/billing/billing.reducer';
import { fromProfile } from '@account-state/profile/profile.reducer';

import { fromTemplate } from '@account-state/template/template.reducer';

export namespace fromAccount {
  export interface State {
    profile: fromProfile.State;
    billing: fromBilling.State;
    template: fromTemplate.State;
  }

  // export class fromAccountReducer {
  //
  // }

  export const ReducerEffects = [
    fromProfile.ReducerEffect,
    fromBilling.ReducerEffect,
    fromTemplate.ReducerEffect
  ];

  // export const reducers: ActionReducerMap<State> = {
  //   profile: fromProfile.reducer,
  //   billing: fromBilling.reducer,
  //   template: fromTemplate.reducer
  // };
}
