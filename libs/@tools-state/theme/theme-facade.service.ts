import { Injectable } from '@angular/core';
import { AclService, ColorInfo, ColorInputSource, Theme, ThemeColors, ThemeFont } from '@common/public-api';
import { dispatch } from '@ngneat/effects';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { ThemeActions } from '@tools-state/theme/theme.actions';
import { ColorChange } from '@tools-state/theme/theme.models';
import { getActiveTheme, getPaletteLoading, getSupportLoading, getThemeList } from '@tools-state/theme/theme.selectors';

import { ThemeService } from '@tools-state/theme/theme.service';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ThemeFacade {
  readonly themeList$: Observable<Theme[]>                 = getThemeList;
  readonly activeTheme$: Observable<Theme>                 = getActiveTheme;
  readonly supportLoading$: Observable<boolean>            = getSupportLoading;
  readonly paletteLoading: Observable<boolean>             = getPaletteLoading;
  readonly canCreateTheme$: Observable<boolean>            = this.acl.canCreateTheme();
  readonly extendedSettingsAvailable$: Observable<boolean> = this.acl.hasExtendedThemeSettings();

  constructor(
    private acl: AclService,
    private themeService: ThemeService) {
  }

  createTheme(theme: Theme) {
    dispatch(ThemeActions.AddTheme(theme));
    dispatch(ProjectActions.SelectTheme(theme.id));
    dispatch(ProjectActions.UpdateProject());
    dispatch(WorkingAreaActions.SyncState());
    dispatch(HistoryActions.Persist());
  }

  selectTheme(id: string) {
    dispatch(ProjectActions.SelectTheme(id));
    dispatch(WorkingAreaActions.SyncState());
    dispatch(ProjectActions.UpdateProject());
    dispatch(HistoryActions.Persist());
  }

  deleteTheme(id) {
    dispatch(ThemeActions.RemoveTheme(id));
    dispatch(WorkingAreaActions.SyncState());
    dispatch(HistoryActions.Persist());
  }

  renameTheme(data: { newName: string; id: string }) {
    dispatch(ThemeActions.UpdateTheme({ id: data.id, name: data.newName }));
    dispatch(WorkingAreaActions.SyncState());
  }

  updateBasic(color: ColorChange) {
    dispatch(ThemeActions.StartShadesLoading());
    this.themeService
      .updateShadedColor('basic', color, 11)
      .pipe(
        map((update: Partial<Theme>) => {
          const shadowEnabled = update.shadow !== 'none';
          update.shadow       = this.themeService.computeShadow(
            shadowEnabled,
            update.dark,
            update.colors.basic
          );
          return update;
        })
      )
      .subscribe(
        (update: Partial<Theme>) => {
          this.updateTheme(update);
          dispatch(ThemeActions.PersistThemeAnalytics({ name: color }));
          dispatch(ThemeActions.StopShadesLoading());
        },
        () => dispatch(ThemeActions.StopShadesLoading())
      );
  }

  updateSupport(name: string, color: ColorChange) {
    dispatch(ThemeActions.StartShadesLoading());
    this.themeService.updateShadedColor(name, color, 9).subscribe(
      (update: Partial<Theme>) => {
        this.updateTheme(update);
        dispatch(ThemeActions.PersistThemeAnalytics({ [name]: color }));
        dispatch(ThemeActions.StopShadesLoading());
      },
      () => dispatch(ThemeActions.StopShadesLoading())
    );
  }

  updateRadius(radius: { value: number; unit: string }) {
    this.themeService.updateRadius(radius).subscribe((update: Partial<Theme>) => this.updateTheme(update));
  }

  updateShadow(shadowEnabled: boolean) {
    this.themeService.updateShadow(shadowEnabled).subscribe((update: Partial<Theme>) => this.updateTheme(update));
  }

  updateFont(font: ThemeFont) {
    this.themeService.updateFont(font).subscribe((update: Partial<Theme>) => this.updateTheme(update));
  }

  lockColor(name: string, locked: boolean) {
    this.themeService.lockColor(name, locked).subscribe((update: Partial<Theme>) => {
      this.updateTheme(update);
      dispatch(ThemeActions.PersistThemeAnalytics({}));
    });
  }

  updatePrimary(colorChange: ColorChange) {
    dispatch(ThemeActions.StartSupportLoading());
    this.themeService.updatePrimary(colorChange).subscribe(
      (update: Partial<Theme>) => {
        this.updateTheme(update);
        dispatch(
          ThemeActions.PersistThemeAnalytics({
            primary: colorChange,
            ...this.getSupportExistingInfo(update.colors, ColorInputSource.FROM_PRIMARY)
          })
        );
        dispatch(ThemeActions.StopSupportLoading());
      },
      () => dispatch(ThemeActions.StopSupportLoading())
    );
  }

  refreshSupport() {
    dispatch(ThemeActions.StartSupportLoading());
    this.themeService.refreshSupport().subscribe(
      (update: Partial<Theme>) => {
        this.updateTheme(update);
        dispatch(
          ThemeActions.PersistThemeAnalytics(
            this.getSupportExistingInfo(update.colors, ColorInputSource.REGENERATED)
          )
        );
        dispatch(ThemeActions.StopSupportLoading());
      },
      () => dispatch(ThemeActions.StopSupportLoading())
    );
  }

  private updateTheme(update) {
    dispatch(ProjectActions.UpdateProject());
    dispatch(ThemeActions.UpdateTheme(update));
    dispatch(WorkingAreaActions.SyncState());
    dispatch(HistoryActions.Persist());
  }

  private getSupportExistingInfo(colors: ThemeColors, inputSource: ColorInputSource) {
    const existingInfo: { [name: string]: Partial<ColorInfo> } = {};
    if (!colors.success.locked) {
      existingInfo.success = { inputSource };
    }
    if (!colors.info.locked) {
      existingInfo.info = { inputSource };
    }
    if (!colors.warning.locked) {
      existingInfo.warning = { inputSource };
    }
    if (!colors.danger.locked) {
      existingInfo.danger = { inputSource };
    }
    return existingInfo;
  }
}
