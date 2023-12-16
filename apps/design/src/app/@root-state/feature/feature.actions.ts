import { createAction, props } from '@ngrx/store';
import { AccessFeature } from '@common';

export namespace FeatureActions {
  export enum ActionTypes {
    ACCESS_FEATURE = '[Feature] Access',
  }

  export const accessFeature = createAction(ActionTypes.ACCESS_FEATURE, props<AccessFeature>());
}
