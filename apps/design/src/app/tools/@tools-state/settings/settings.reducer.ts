import { createReducer, on } from '@ngrx/store';

import { SettingsActions } from '@tools-state/settings/settings.actions';

export namespace fromSettings {
  export interface State {
    componentTreePagesSidebarScale: number;
    xray: boolean;
  }

  const initialState = {
    componentTreePagesSidebarScale: 0.3,
    xray: true
  };

  export const reducer = createReducer(
    initialState,
    on(SettingsActions.loadSettingsSuccess, (state: State, { settings }) => ({ ...state, ...settings })),
    on(SettingsActions.updateComponentTreePageSidebarScale, (state: State, { scale }) => ({
      ...state,
      componentTreePagesSidebarScale: scale
    })),
    on(SettingsActions.toggleXRay, (state: State) => ({
      ...state,
      xray: !state.xray
    }))
  );
}
