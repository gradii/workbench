import { StoreItem } from '@common';
import { createSelector } from '@ngrx/store';

import { fromStoreItem } from '@tools-state/data/store-item/store-item.reducer';
import { fromTools } from '@tools-state/tools.reducer';
import { getToolsState } from '@tools-state/tools.selector';

export const getStoreItemState = createSelector(getToolsState, (state: fromTools.State) => state.storeItem);

export const getStoreItemList = createSelector(getStoreItemState, fromStoreItem.selectAll);

export const getStoreItemListWithoutState = createSelector(getStoreItemList, (storeItemList: StoreItem[]) => {
  return storeItemList.map(item => ({ ...item, value: item.initialValue }));
});

export const getStoreItemById = createSelector(getStoreItemState, (state: fromStoreItem.State, id: string) => {
  return state.entities[id];
});
