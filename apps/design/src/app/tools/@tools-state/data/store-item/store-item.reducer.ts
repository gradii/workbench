import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { StoreItem } from '@common';
import { StoreItemActions } from '@tools-state/data/store-item/store-item.actions';

export namespace fromStoreItem {
  export interface State extends EntityState<StoreItem> {
    ids: string[];
  }

  const adapter: EntityAdapter<StoreItem> = createEntityAdapter<StoreItem>();

  const initialState: State = adapter.getInitialState({
    ids: []
  });

  export const reducer = createReducer(
    initialState,
    on(StoreItemActions.replaceStoreItemList, (state, { list }) => adapter.setAll(list, state)),
    on(StoreItemActions.addStoreItemList, (state, { list }) => adapter.addMany(list, state)),
    on(StoreItemActions.createStoreItem, (state, { storeItem }) => adapter.addOne(storeItem, state)),
    on(StoreItemActions.updateStoreItem, (state, { update }) => adapter.updateOne(update, state)),
    on(StoreItemActions.updateStoreItemList, (state, { list }) => adapter.updateMany(list, state)),
    on(StoreItemActions.deleteStoreItem, (state, { id }) => adapter.removeOne(id, state)),
    on(StoreItemActions.deleteStoreItemList, (state, { idList }) => adapter.removeMany(idList, state))
  );

  export const { selectAll } = adapter.getSelectors();
}
