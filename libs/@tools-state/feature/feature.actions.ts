import { createAction } from '@ngneat/effects';
import { PuffComponentOrDirective } from '@tools-state/common.model';
import { PuffFeature } from '@tools-state/feature/feature.model';


export namespace FeatureActions {
  export enum ActionTypes {
    AddFeature             = '[Feature] Add Feature',
    UpdateFeature          = '[Feature] Update Feature',
    UpdateFeatureList      = '[Feature] Update Feature List',
    AddFeatureList         = '[Feature] Add Feature List',
    ReplaceWithFeatureList = '[Feature] Replace With Feature List',
    RemoveFeatureList      = '[Feature] Remove Feature List',
    ShiftForwardAfterIndex = '[Feature] Shift Forward After Index',
  }

  export const AddFeature = createAction(
    ActionTypes.AddFeature,
    (feature: PuffFeature) => ({ feature })
  );

  export const UpdateFeature = createAction(
    ActionTypes.UpdateFeature,
    (feature: Partial<PuffFeature>) => ({ feature })
  );

  export const UpdateFeatureList = createAction(
    ActionTypes.UpdateFeatureList,
    (updateList: Partial<PuffFeature>[]) => ({ updateList })
  );

  export const AddFeatureList = createAction(
    ActionTypes.AddFeatureList,
    (featureList: PuffComponentOrDirective[]) => ({ featureList })
  );

  export const ReplaceWithFeatureList = createAction(
    ActionTypes.ReplaceWithFeatureList,
    (featureList: PuffComponentOrDirective[]) => ({ featureList })
  );

  export const RemoveFeatureList = createAction(
    ActionTypes.RemoveFeatureList,
    (featureIdList: string[]) => ({ featureIdList })
  );

  export const ShiftForwardAfterFeature = createAction(
    ActionTypes.ShiftForwardAfterIndex,
    (parentSlotId: string, index: number, shift: number) => ({ parentSlotId, index, shift })
  );
}
