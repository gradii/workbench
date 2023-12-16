import { createAction, props } from '@ngrx/store';

import { Settings } from '@tools-state/settings/settings.model';

export namespace SettingsActions {
  export enum ActionTypes {
    LoadSettings = '[Settings] Load',
    LoadSettingsSuccess = '[Settings] Load Settings Success',

    UpdateComponentTreePageSidebarScale = '[Settings] ComponentTree/Page Sidebar Scale',
    ToggleXRay = '[Settings] X Ray',
  }

  export const loadSettings = createAction(ActionTypes.LoadSettings);
  export const loadSettingsSuccess = createAction(ActionTypes.LoadSettingsSuccess, props<{ settings: Settings }>());
  export const updateComponentTreePageSidebarScale = createAction(
    ActionTypes.UpdateComponentTreePageSidebarScale,
    props<{ scale: number }>()
  );
  export const toggleXRay = createAction(ActionTypes.ToggleXRay);
}
