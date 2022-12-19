import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';

import { SettingsActions } from '@tools-state/settings/settings.actions';
import { tap } from 'rxjs/operators';

export namespace fromSettings {
  export interface State {
    componentTreePagesSidebarScale: number;
    xray: boolean;
  }

  const initialState = {
    componentTreePagesSidebarScale: 0.3,
    xray                          : true
  };

  const { state, config } = createState(
    withProps<State>(initialState)
  );

  export const fromSettingsStore = new Store({ name: 'kitchen-settings', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect(
      (actions) => {
        return actions.pipe(
          tap((action) => {
            switch (action.type) {
              case SettingsActions.ActionTypes.LoadSettingsSuccess:
                return fromSettingsStore.update((state) => ({
                  ...state,
                  ...action.settings
                }));
              case SettingsActions.ActionTypes.UpdateComponentTreePageSidebarScale:
                return fromSettingsStore.update((state) => ({
                  ...state,
                  componentTreePagesSidebarScale: action.scale
                }));
              case SettingsActions.ActionTypes.ToggleXRay:
                return fromSettingsStore.update((state) => ({
                  ...state,
                  xray: !state.xray
                }));
            }
          })
        );
      }
    );
  }

  // export const reducer = createReducer(
  //   initialState,
  //   on(SettingsActions.loadSettingsSuccess, (state: State, { settings }) => ({ ...state, ...settings })),
  //   on(SettingsActions.updateComponentTreePageSidebarScale, (state: State, { scale }) => ({
  //     ...state,
  //     componentTreePagesSidebarScale: scale
  //   })),
  //   on(SettingsActions.toggleXRay, (state: State) => ({
  //     ...state,
  //     xray: !state.xray
  //   }))
  // );
}
