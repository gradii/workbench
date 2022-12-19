import { createAction } from '@ngneat/effects';

import { Page } from '@tools-state/page/page.model';

export namespace PageActions {
  export enum ActionTypes {
    AddPage             = '[Page] Add Page',
    AddPageList         = '[Page] Add Page List',
    ReplaceWithPageList = '[Page] Replace With Page List',
    UpdatePage          = '[Page] Update Page',
    RemovePage          = '[Page] Remove Page',
    RemovePageList      = '[Page] Remove Page List',
    SetActivePage       = '[Page] Set Active Page',
    SetPageFilter       = '[Page] Set Page Filter',
  }

  export const AddPage = createAction(
    ActionTypes.AddPage, (page: Page) => ({ page })
  );

  export const AddPageList = createAction(
    ActionTypes.AddPageList, (pageList: Page[]) => ({ pageList })
  );

  export const ReplaceWithPageList = createAction(
    ActionTypes.ReplaceWithPageList, (pageList: Page[]) => ({ pageList })
  );

  export const UpdatePage = createAction(
    ActionTypes.UpdatePage, (page: Partial<Page>) => ({ page })
  );

  export const SetActivePage = createAction(
    ActionTypes.SetActivePage, (pageId: string, setFromKitchen: boolean) => ({ pageId, setFromKitchen })
  );

  export const RemovePage = createAction(
    ActionTypes.RemovePage, (pageId: string) => ({ pageId })
  );

  export const RemovePageList = createAction(
    ActionTypes.RemovePageList, (ids: string[]) => ({ ids })
  );

  export const SetPageFilter = createAction(
    ActionTypes.SetPageFilter, (filter: string) => ({ filter })
  );
}
