import { StoreItem } from '@common/public-api';
import { createAction } from '@ngneat/effects';

export namespace StoreItemActions {
  export enum ActionTypes {
    AddStoreItemList     = '[StoreItem] Add StoreItem List',
    ReplaceStoreItemList = '[StoreItem] Replace StoreItem List',
    CreateStoreItem      = '[StoreItem] Create StoreItem',
    UpdateStoreItem      = '[StoreItem] Update StoreItem',
    UpdateStoreItemList  = '[StoreItem] Update StoreItem List',
    DeleteStoreItem      = '[StoreItem] Delete StoreItem',
    DeleteStoreItemList  = '[StoreItem] Delete StoreItem List',
  }

  export const AddStoreItemList     = createAction(ActionTypes.AddStoreItemList, (list: StoreItem[]) => ({ list }));
  export const ReplaceStoreItemList = createAction(ActionTypes.ReplaceStoreItemList, (list: StoreItem[]) => ({ list }));
  export const CreateStoreItem      = createAction(ActionTypes.CreateStoreItem,
    (storeItem: StoreItem) => ({ storeItem }));
  export const UpdateStoreItem      = createAction(ActionTypes.UpdateStoreItem,
    (update: Partial<StoreItem>) => ({ update }));
  export const UpdateStoreItemList  = createAction(
    ActionTypes.UpdateStoreItemList,
    (list: Partial<StoreItem>[]) => ({ list })
  );
  export const DeleteStoreItem      = createAction(ActionTypes.DeleteStoreItem, (id: string) => ({ id }));
  export const DeleteStoreItemList  = createAction(ActionTypes.DeleteStoreItemList, (idList: string[]) => ({ idList }));
}
