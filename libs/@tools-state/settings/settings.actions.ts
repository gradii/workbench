import { createAction } from '@ngneat/effects';
import { Settings } from '@tools-state/settings/settings.model';

export namespace SettingsActions {
  export enum ActionTypes {
    LoadSettings                        = '[Settings] Load',
    LoadSettingsSuccess                 = '[Settings] Load Settings Success',

    UpdateComponentTreePageSidebarScale = '[Settings] ComponentTree/Page Sidebar Scale',
    ToggleXRay                          = '[Settings] X Ray',
  }

  export const loadSettings                        = createAction(ActionTypes.LoadSettings);
  export const loadSettingsSuccess                 = createAction(ActionTypes.LoadSettingsSuccess,
    (settings: Settings) => ({ settings }));
  export const updateComponentTreePageSidebarScale = createAction(
    ActionTypes.UpdateComponentTreePageSidebarScale,
    (scale: number) => ({ scale })
  );
  export const toggleXRay                          = createAction(ActionTypes.ToggleXRay);
}
