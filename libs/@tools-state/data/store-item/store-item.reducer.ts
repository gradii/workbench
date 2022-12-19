import { StoreItem } from '@common/public-api';
import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import {
  addEntities, EntitiesState, setEntities, updateEntities, upsertEntities, withEntities
} from '@ngneat/elf-entities';
import { deleteEntities } from '@ngneat/elf-entities';
import { StoreItemActions } from '@tools-state/data/store-item/store-item.actions';
import { tap } from 'rxjs/operators';

export namespace fromStoreItem {
  export interface State {
    ids: string[];
    entities: EntitiesState<StoreItem>;
  }

  // const adapter: EntityAdapter<StoreItem> = createEntityAdapter<StoreItem>();

  const initialState: Partial<State> = {
    ids: []
  };

  const { state, config } = createState(
    withProps<Partial<State>>(initialState),
    withEntities<StoreItem>()
  );

  export const fromStoreItemStore = new Store({ name: 'kitchen-storeItem', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect(
      (actions) => {
        return actions.pipe(
          tap((action) => {
            switch (action.type) {
              case StoreItemActions.ActionTypes.AddStoreItemList:
                return fromStoreItemStore.update(addEntities(action.list));
              case StoreItemActions.ActionTypes.ReplaceStoreItemList:
                return fromStoreItemStore.update(setEntities(action.list));
              case StoreItemActions.ActionTypes.CreateStoreItem:
                return fromStoreItemStore.update(addEntities(action.storeItem));
              case StoreItemActions.ActionTypes.UpdateStoreItem:
                return fromStoreItemStore.update(updateEntities(action.update.id, action.update));
              case StoreItemActions.ActionTypes.UpdateStoreItemList:
                return fromStoreItemStore.update(upsertEntities(action.list));
              case StoreItemActions.ActionTypes.DeleteStoreItem:
                return fromStoreItemStore.update(deleteEntities(action.id));
              case StoreItemActions.ActionTypes.DeleteStoreItemList:
                return fromStoreItemStore.update(deleteEntities(action.idList.map(id => id)));
            }
          })
        );
      }
    );
  }

  // export const reducer = createReducer(
  //   initialState,
  //   on(StoreItemActions.addStoreItemList, (state, { list }) => adapter.addMany(list, state)),
  //   on(StoreItemActions.replaceStoreItemList, (state, { list }) => adapter.setAll(list, state)),
  //   on(StoreItemActions.createStoreItem, (state, { storeItem }) => adapter.addOne(storeItem, state)),
  //   on(StoreItemActions.updateStoreItem, (state, { update }) => adapter.updateOne(update, state)),
  //   on(StoreItemActions.updateStoreItemList, (state, { list }) => adapter.updateMany(list, state)),
  //   on(StoreItemActions.deleteStoreItem, (state, { id }) => adapter.removeOne(id, state)),
  //   on(StoreItemActions.deleteStoreItemList, (state, { idList }) => adapter.removeMany(idList, state))
  // );

  // export const { selectAll } = adapter.getSelectors();
}
