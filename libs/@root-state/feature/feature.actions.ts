import { AccessFeature, Feature } from '@common/public-api';
import { createAction } from '@ngneat/effects';

export namespace FeatureActions {
  export enum ActionTypes {
    ACCESS_FEATURE = '[Feature] Access',
  }

  export const AccessFeature = createAction(ActionTypes.ACCESS_FEATURE,
    (feature: Feature, element?: string): AccessFeature => ({ feature, element }));
}
