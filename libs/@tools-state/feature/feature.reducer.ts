import { Actions, createEffect } from '@ngneat/effects';
import { createState, Reducer, Store, withProps } from '@ngneat/elf';
import {
  addEntities, deleteEntities, EntitiesState, setEntities, updateEntities, upsertEntities, withEntities
} from '@ngneat/elf-entities';
import { FeatureActions } from '@tools-state/feature/feature.actions';
import { PuffFeature } from '@tools-state/feature/feature.model';

import { tap } from 'rxjs/operators';

declare const ngDevMode: boolean;

export namespace fromFeatures {

  export interface State {
    ids: string[];
    activeFeatureIdList: string[];
    entities: EntitiesState<PuffFeature>;
  }

  const initialState: Omit<State, 'entities'> = {
    ids                : [],
    activeFeatureIdList: []
  };

  const { state, config } = createState(
    withProps<Omit<State, 'entities'>>(initialState),
    withEntities<PuffFeature>()
  );

  export const fromFeaturesStore = new Store({ name: 'kitchen-features', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect((actions: Actions) => {
      return actions.pipe(
        tap((action) => {
          switch (action.type) {
            case FeatureActions.ActionTypes.AddFeature:
              return fromFeatures.fromFeaturesStore.update(
                addEntities(action.feature)
              );
            case FeatureActions.ActionTypes.UpdateFeature:
              return fromFeatures.fromFeaturesStore.update(
                updateEntities(action.feature.id, action.feature)
              );
            case FeatureActions.ActionTypes.ReplaceWithFeatureList:
              return fromFeatures.fromFeaturesStore.update(
                setEntities(action.featureList)
              );
            default:
              return state;
          }
        })
      );
    });
  }


  function removeFeatureList(action/*: FeatureActions.RemoveFeatureList*/
  ): Reducer<any> {
    return (state, ctx) => {
      let newState: State = state;

      for (const featureId of action.featureIdList) {
        const feature = newState.entities[featureId];

        /**
         * In case of removing nested Features, it might happen if we remove parent Feature first of all
         * including all it's children and then trying to remove its child (we selected parent and it's
         * children and then pressed delete button). In that case, we still have id in the list of ids to remove however,
         * we have no instance and no need to remove it again.
         * */
        if (!feature) {
          continue;
        }

        newState = removeFeature(feature)(newState, ctx);
      }

      return newState;
    };
  }

  function removeFeature(feature: PuffFeature): Reducer<any> {
    return (state, ctx) => {
      const shiftBackwardUpdate: Partial<PuffFeature>[] = Object.values(state.entities)
        .filter((c: PuffFeature) => c.hostId === feature.hostId)
        .filter((c: PuffFeature) => c.index >= feature.index)
        .map((c: PuffFeature) => ({ id: c.id, index: c.index - 1 }));

      const newState = deleteEntities(feature.id)(state, ctx);
      return upsertEntities(shiftBackwardUpdate)(newState, ctx);
    };
  }
}
