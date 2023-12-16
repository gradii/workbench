import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { PageActions } from './page.actions';
import { Page } from './page.model';

export namespace fromPages {
  export interface State extends EntityState<Page> {
    activePageId: string;
    setFromOven: boolean;
    ids: string[];
    pageFilter: string;
  }

  const adapter: EntityAdapter<Page> = createEntityAdapter<Page>();

  const initialState: State = adapter.getInitialState({
    ids: [],
    activePageId: null,
    setFromOven: false,
    pageFilter: ''
  });

  export function reducer(state = initialState, action: PageActions.ActionsUnion) {
    switch (action.type) {
      case PageActions.ActionTypes.AddPage:
        return adapter.addOne(action.page, state);
      case PageActions.ActionTypes.AddPageList:
        return adapter.addMany(action.pageList, state);
      case PageActions.ActionTypes.ReplaceWithPageList:
        return adapter.setAll(action.pageList, state);
      case PageActions.ActionTypes.UpdatePage:
        return adapter.updateOne(action.page, state);
      case PageActions.ActionTypes.RemovePageList:
        return adapter.removeMany(action.ids, state);
      case PageActions.ActionTypes.SetActivePage:
        return { ...state, activePageId: action.pageId, setFromOven: action.setFromOven };
      case PageActions.ActionTypes.SetPageFilter:
        return { ...state, pageFilter: action.filter };
      default:
        return state;
    }
  }

  export const { selectAll } = adapter.getSelectors();
}
