import { Actions, createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import {
  addEntities, deleteEntities, EntitiesState, setEntities, updateEntities, withEntities
} from '@ngneat/elf-entities';
import { tap } from 'rxjs/operators';
import { PageActions } from './page.actions';
import { Page } from './page.model';

export namespace fromPages {
  export interface State {
    activePageId: string;
    setFromKitchen: boolean;
    ids: string[];
    pageFilter: string;
    entities: EntitiesState<Page>;
  }

  // const adapter: EntityAdapter<Page> = createEntityAdapter<Page>();

  const initialState: State = {
    ids           : [],
    activePageId  : null,
    setFromKitchen: false,
    pageFilter    : '',
    entities      : {}
  };

  const { state, config } = createState(
    withProps<State>(initialState),
    withEntities<Page>()
  );

  export const fromPagesStore = new Store({ name: 'kitchen-pages', state, config });

  export class fromPagesReducer {
    addPage(page: Page) {
      fromPagesStore.update(addEntities(page));
    }
  }

  export class ReducerEffect {
    reducerEffect = createEffect((actions: Actions) => {
      return actions.pipe(
        tap((action) => {
          switch (action.type) {
            case PageActions.ActionTypes.AddPage:
              return fromPagesStore.update(addEntities(action.page));
            case PageActions.ActionTypes.AddPageList:
              return fromPagesStore.update(addEntities(action.pageList));
            case PageActions.ActionTypes.ReplaceWithPageList:
              return fromPagesStore.update(setEntities(action.pageList));
            case PageActions.ActionTypes.UpdatePage:
              return fromPagesStore.update(updateEntities(action.page.id, action.page));
            case PageActions.ActionTypes.RemovePageList:
              return fromPagesStore.update(deleteEntities(action.ids));
            case PageActions.ActionTypes.SetActivePage:
              return fromPagesStore.update((state) => ({
                ...state,
                activePageId: action.pageId, setFromKitchen: action.setFromKitchen
              }));
            case PageActions.ActionTypes.SetPageFilter:
              return fromPagesStore.update((state) => ({
                ...state,
                pageFilter: action.filter
              }));
          }
        })
      );
    });
  }

  // export function reducer(state = initialState, action) {
  //   switch (action.type) {
  //     case PageActions.ActionTypes.AddPage:
  //       return adapter.addOne(action.page, state);
  //     case PageActions.ActionTypes.AddPageList:
  //       return adapter.addMany(action.pageList, state);
  //     case PageActions.ActionTypes.ReplaceWithPageList:
  //       return adapter.setAll(action.pageList, state);
  //     case PageActions.ActionTypes.UpdatePage:
  //       return adapter.updateOne(action.page, state);
  //     case PageActions.ActionTypes.RemovePageList:
  //       return adapter.removeMany(action.ids, state);
  //     case PageActions.ActionTypes.SetActivePage:
  //       return { ...state, activePageId: action.pageId, setFromKitchen: action.setFromKitchen };
  //     case PageActions.ActionTypes.SetPageFilter:
  //       return { ...state, pageFilter: action.filter };
  //     default:
  //       return state;
  //   }
  // }

  // export const { selectAll } = adapter.getSelectors();
}
