import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { StoreItem } from '@common';

export namespace StoreItemActions {
  export enum ActionTypes {
    AddStoreItemList = '[StoreItem] Add StoreItem List',
    ReplaceStoreItemList = '[StoreItem] Replace StoreItem List',
    CreateStoreItem = '[StoreItem] Create StoreItem',
    UpdateStoreItem = '[StoreItem] Update StoreItem',
    UpdateStoreItemList = '[StoreItem] Update StoreItem List',
    DeleteStoreItem = '[StoreItem] Delete StoreItem',
    DeleteStoreItemList = '[StoreItem] Delete StoreItem List',
  }

  export const addStoreItemList = createAction(ActionTypes.AddStoreItemList, props<{ list: StoreItem[] }>());
  export const replaceStoreItemList = createAction(ActionTypes.ReplaceStoreItemList, props<{ list: StoreItem[] }>());
  export const createStoreItem = createAction(ActionTypes.CreateStoreItem, props<{ storeItem: StoreItem }>());
  export const updateStoreItem = createAction(ActionTypes.UpdateStoreItem, props<{ update: Update<StoreItem> }>());
  export const updateStoreItemList = createAction(
    ActionTypes.UpdateStoreItemList,
    props<{ list: Update<StoreItem>[] }>()
  );
  export const deleteStoreItem = createAction(ActionTypes.DeleteStoreItem, props<{ id: string }>());
  export const deleteStoreItemList = createAction(ActionTypes.DeleteStoreItemList, props<{ idList: string[] }>());
}
