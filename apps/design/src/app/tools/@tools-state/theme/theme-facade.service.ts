import { Injectable } from '@angular/core';
import { AclService, ColorInfo, ColorInputSource, Theme, ThemeColors, ThemeFont } from '@common';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ThemeService } from '@tools-state/theme/theme.service';
import { ProjectActions } from '@tools-state/project/project.actions';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ThemeActions } from '@tools-state/theme/theme.actions';
import { ColorChange } from '@tools-state/theme/theme.models';
import { fromTheme } from '@tools-state/theme/theme.reducer';
import { getActiveTheme, getPaletteLoading, getSupportLoading, getThemeList } from '@tools-state/theme/theme.selectors';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';

@Injectable({ providedIn: 'root' })
export class ThemeFacade {
  readonly themeList$: Observable<Theme[]> = this.store.pipe(select(getThemeList));
  readonly activeTheme$: Observable<Theme> = this.store.pipe(select(getActiveTheme));
  readonly supportLoading$: Observable<boolean> = this.store.pipe(select(getSupportLoading));
  readonly paletteLoading: Observable<boolean> = this.store.pipe(select(getPaletteLoading));
  readonly canCreateTheme$: Observable<boolean> = this.acl.canCreateTheme();
  readonly extendedSettingsAvailable$: Observable<boolean> = this.acl.hasExtendedThemeSettings();

  constructor(private store: Store<fromTheme.State>, private acl: AclService, private themeService: ThemeService) {
  }

  createTheme(theme: Theme) {
    this.store.dispatch(ThemeActions.addTheme({ theme }));
    this.store.dispatch(new ProjectActions.SelectTheme(theme.id));
    this.store.dispatch(new ProjectActions.UpdateProject());
    this.store.dispatch(new WorkingAreaActions.SyncState());
    this.store.dispatch(new HistoryActions.Persist());
  }

  selectTheme(id: string) {
    this.store.dispatch(new ProjectActions.SelectTheme(id));
    this.store.dispatch(new WorkingAreaActions.SyncState());
    this.store.dispatch(new ProjectActions.UpdateProject());
    this.store.dispatch(new HistoryActions.Persist());
  }

  deleteTheme(id) {
    this.store.dispatch(ThemeActions.removeTheme({ themeId: id }));
    this.store.dispatch(new WorkingAreaActions.SyncState());
    this.store.dispatch(new HistoryActions.Persist());
  }

  renameTheme(data: { newName: string; id: string }) {
    this.store.dispatch(ThemeActions.updateTheme({ update: { id: data.id, changes: { name: data.newName } } }));
    this.store.dispatch(new WorkingAreaActions.SyncState());
  }

  updateBasic(color: ColorChange) {
    this.store.dispatch(ThemeActions.startShadesLoading());
    this.themeService
      .updateShadedColor('basic', color, 11)
      .pipe(
        map((update: Update<Theme>) => {
          const shadowEnabled = update.changes.shadow !== 'none';
          update.changes.shadow = this.themeService.computeShadow(
            shadowEnabled,
            update.changes.dark,
            update.changes.colors.basic
          );
          return update;
        })
      )
      .subscribe(
        (update: Update<Theme>) => {
          this.updateTheme(update);
          this.store.dispatch(ThemeActions.persistThemeAnalytics({ [name]: color }));
          this.store.dispatch(ThemeActions.stopShadesLoading());
        },
        () => this.store.dispatch(ThemeActions.stopShadesLoading())
      );
  }

  updateSupport(name: string, color: ColorChange) {
    this.store.dispatch(ThemeActions.startShadesLoading());
    this.themeService.updateShadedColor(name, color, 9).subscribe(
      (update: Update<Theme>) => {
        this.updateTheme(update);
        this.store.dispatch(ThemeActions.persistThemeAnalytics({ [name]: color }));
        this.store.dispatch(ThemeActions.stopShadesLoading());
      },
      () => this.store.dispatch(ThemeActions.stopShadesLoading())
    );
  }

  updateRadius(radius: { value: number; unit: string }) {
    this.themeService.updateRadius(radius).subscribe((update: Update<Theme>) => this.updateTheme(update));
  }

  updateShadow(shadowEnabled: boolean) {
    this.themeService.updateShadow(shadowEnabled).subscribe((update: Update<Theme>) => this.updateTheme(update));
  }

  updateFont(font: ThemeFont) {
    this.themeService.updateFont(font).subscribe((update: Update<Theme>) => this.updateTheme(update));
  }

  lockColor(name: string, locked: boolean) {
    this.themeService.lockColor(name, locked).subscribe((update: Update<Theme>) => {
      this.updateTheme(update);
      this.store.dispatch(ThemeActions.persistThemeAnalytics({}));
    });
  }

  updatePrimary(colorChange: ColorChange) {
    this.store.dispatch(ThemeActions.startSupportLoading());
    this.themeService.updatePrimary(colorChange).subscribe(
      (update: Update<Theme>) => {
        this.updateTheme(update);
        this.store.dispatch(
          ThemeActions.persistThemeAnalytics({
            primary: colorChange,
            ...this.getSupportExistingInfo(update.changes.colors, ColorInputSource.FROM_PRIMARY)
          })
        );
        this.store.dispatch(ThemeActions.stopSupportLoading());
      },
      () => this.store.dispatch(ThemeActions.stopSupportLoading())
    );
  }

  refreshSupport() {
    this.store.dispatch(ThemeActions.startSupportLoading());
    this.themeService.refreshSupport().subscribe(
      (update: Update<Theme>) => {
        this.updateTheme(update);
        this.store.dispatch(
          ThemeActions.persistThemeAnalytics(
            this.getSupportExistingInfo(update.changes.colors, ColorInputSource.REGENERATED)
          )
        );
        this.store.dispatch(ThemeActions.stopSupportLoading());
      },
      () => this.store.dispatch(ThemeActions.stopSupportLoading())
    );
  }

  private updateTheme(update) {
    this.store.dispatch(new ProjectActions.UpdateProject());
    this.store.dispatch(ThemeActions.updateTheme({ update }));
    this.store.dispatch(new WorkingAreaActions.SyncState());
    this.store.dispatch(new HistoryActions.Persist());
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
