import { select } from '@ngneat/elf';
import { selectAllEntities } from '@ngneat/elf-entities';
import { PuffFeature } from './feature.model';

import { fromFeatures } from './feature.reducer';

// export interface FeatureSubEntities {
//   featureList: PuffFeature[];
//   slotList: Slot[];
// }

export const getFeaturesState = fromFeatures.fromFeaturesStore;

export const getFeatureList = getFeaturesState.pipe(selectAllEntities());
export const getFeatureMap  = getFeaturesState.pipe(select((state: fromFeatures.State) => state.entities));

export const getFeatureListFromSlotId = (slotId: string) => {
  return getFeatureList.pipe(
    select((featureList: PuffFeature[]) => featureList.filter((feature: PuffFeature) => feature.hostId === slotId))
  );
}