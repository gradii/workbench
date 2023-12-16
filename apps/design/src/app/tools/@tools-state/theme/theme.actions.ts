import { ColorInfo, Theme } from '@common';
import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

export namespace ThemeActions {
  export enum ActionTypes {
    LoadThemeList = '[Theme] Load Theme List',
    AddTheme = '[Theme] Add Theme',
    UpdateTheme = '[Theme] Update Theme',
    RemoveTheme = '[Theme] Remove Theme',
    PersistThemeAnalytics = '[Theme] Persist Theme Analytics',
    StartLoadShades = '[Theme] Start Shades Loading',
    StopLoadShades = '[Theme] Stop Shades Loading',
    StartLoadSupport = '[Theme] Start Support Loading',
    StopLoadSupport = '[Theme] Stop Support Loading',
  }

  export const loadThemeList = createAction(ActionTypes.LoadThemeList, props<{ themeList: Theme[] }>());
  export const updateTheme = createAction(ActionTypes.UpdateTheme, props<{ update: Update<Theme> }>());
  export const addTheme = createAction(ActionTypes.AddTheme, props<{ theme: Theme }>());
  export const removeTheme = createAction(ActionTypes.RemoveTheme, props<{ themeId: string }>());
  export const persistThemeAnalytics = createAction(
    ActionTypes.PersistThemeAnalytics,
    props<{ [name: string]: Partial<ColorInfo> }>()
  );
  export const startSupportLoading = createAction(ActionTypes.StartLoadSupport);
  export const stopSupportLoading = createAction(ActionTypes.StopLoadSupport);
  export const startShadesLoading = createAction(ActionTypes.StartLoadShades);
  export const stopShadesLoading = createAction(ActionTypes.StopLoadShades);
}
