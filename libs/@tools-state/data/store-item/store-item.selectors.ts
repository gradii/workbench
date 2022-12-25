import { StoreItem } from '@common/public-api';
import { select } from '@ngneat/elf';
import { selectAllEntities } from '@ngneat/elf-entities';

import { fromStoreItem } from '@tools-state/data/store-item/store-item.reducer';

export const getStoreItemState = fromStoreItem.fromStoreItemStore;

export const getStoreItemList = getStoreItemState.pipe(selectAllEntities());

export const getStoreItemListWithoutState = getStoreItemList.pipe(select((storeItemList: StoreItem[]) => {
  return storeItemList.map(item => ({ ...item, value: item.initialValue }));
}));

export const getStoreItemById = (id: string) => getStoreItemState.pipe(select((state: fromStoreItem.State) => {
  return state.entities[id];
}));
