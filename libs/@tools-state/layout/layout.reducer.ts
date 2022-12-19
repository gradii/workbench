import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import { BakeryLayout } from '@tools-state/layout/layout.model';
import { LayoutActions } from '@tools-state/layout/layout.actions';
import { tap } from 'rxjs/operators';

export namespace fromLayout {
  export interface State {
    layout: BakeryLayout;
  }

  const initialState: State = {
    layout: null
  };

  const { state, config } = createState(
    withProps<State>(initialState)
  );

  export const fromLayoutStore = new Store({ name: 'kitchen-layout', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect(
      (actions) => actions.pipe(
        tap((action) => {
          switch (action.type) {
            case LayoutActions.ActionTypes.SetLayout:
              return fromLayoutStore.update(state => ({ ...state, layout: action.layout }));
            case LayoutActions.ActionTypes.UpdateLayout:
              return fromLayoutStore.update(state => ({ ...state, layout: { ...state.layout, ...action.change } }));
            default:
          }
        })
      )
    );
  }

  // export function reducer(state = initialState, action: LayoutActions.ActionsUnion) {
  //   switch (action.type) {
  //     case LayoutActions.ActionTypes.SetLayout:
  //       return { ...state, layout: action.layout };
  //     case LayoutActions.ActionTypes.UpdateLayout:
  //       return { ...state, layout: { ...state.layout, ...action.change } };
  //     default:
  //       return state;
  //   }
  // }
}
