import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';

import { Page } from '@tools-state/page/page.model';

export namespace PageActions {
  export enum ActionTypes {
    AddPage = '[Page] Add Page',
    AddPageList = '[Page] Add Page List',
    ReplaceWithPageList = '[Page] Replace With Page List',
    UpdatePage = '[Page] Update Page',
    RemovePage = '[Page] Remove Page',
    RemovePageList = '[Page] Remove Page List',
    SetActivePage = '[Page] Set Active Page',
    SetPageFilter = '[Page] Set Page Filter',
  }

  export class AddPage implements Action {
    readonly type = ActionTypes.AddPage;

    constructor(public page: Page) {
    }
  }

  export class AddPageList implements Action {
    readonly type = ActionTypes.AddPageList;

    constructor(public pageList: Page[]) {
    }
  }

  export class ReplaceWithPageList implements Action {
    readonly type = ActionTypes.ReplaceWithPageList;

    constructor(public pageList: Page[]) {
    }
  }

  export class UpdatePage implements Action {
    readonly type = ActionTypes.UpdatePage;

    constructor(public page: Update<Page>) {
    }
  }

  export class SetActivePage implements Action {
    readonly type = ActionTypes.SetActivePage;

    constructor(public pageId: string, public setFromOven: boolean) {
    }
  }

  export class RemovePage implements Action {
    readonly type = ActionTypes.RemovePage;

    constructor(public pageId: string) {
    }
  }

  export class RemovePageList implements Action {
    readonly type = ActionTypes.RemovePageList;

    constructor(public ids: string[]) {
    }
  }

  export class SetPageFilter implements Action {
    readonly type = ActionTypes.SetPageFilter;

    constructor(public filter: string) {
    }
  }

  export type ActionsUnion =
    | AddPage
    | AddPageList
    | ReplaceWithPageList
    | UpdatePage
    | RemovePage
    | RemovePageList
    | SetPageFilter
    | SetActivePage;
}
