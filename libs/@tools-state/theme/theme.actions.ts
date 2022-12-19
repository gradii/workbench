import { ColorInfo, Theme } from '@common/public-api';
import { createAction, props } from '@ngneat/effects';

export namespace ThemeActions {
  export enum ActionTypes {
    LoadThemeList         = '[Theme] Load Theme List',
    AddTheme              = '[Theme] Add Theme',
    UpdateTheme           = '[Theme] Update Theme',
    RemoveTheme           = '[Theme] Remove Theme',
    PersistThemeAnalytics = '[Theme] Persist Theme Analytics',
    StartShadesLoading    = '[Theme] Start Shades Loading',
    StopShadesLoading     = '[Theme] Stop Shades Loading',
    StartSupportLoading   = '[Theme] Start Support Loading',
    StopSupportLoading    = '[Theme] Stop Support Loading',
  }

  export const LoadThemeList         = createAction(ActionTypes.LoadThemeList, (themeList: Theme[]) => ({ themeList }));
  export const UpdateTheme           = createAction(ActionTypes.UpdateTheme, (update: Partial<Theme>) => ({ update }));
  export const AddTheme              = createAction(ActionTypes.AddTheme, (theme: Theme) => ({ theme }));
  export const RemoveTheme           = createAction(ActionTypes.RemoveTheme, (themeId: string) => ({ themeId }));
  export const PersistThemeAnalytics = createAction(
    ActionTypes.PersistThemeAnalytics,
    props<{ [name: string]: Partial<ColorInfo> }>()
  );
  export const StartSupportLoading   = createAction(ActionTypes.StartSupportLoading);
  export const StopSupportLoading    = createAction(ActionTypes.StopSupportLoading);
  export const StartShadesLoading    = createAction(ActionTypes.StartShadesLoading);
  export const StopShadesLoading     = createAction(ActionTypes.StopShadesLoading);
}
