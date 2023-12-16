import { Injectable } from '@angular/core';
import { ExtendedShadedColor, ShadedColor, Theme, ThemeColors, ThemeFont } from '@common';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

import { getActiveProjectId } from '@tools-state/project/project.selectors';
import { PainterApiService } from '@tools-state/theme/painter-api.service';
import { ThemeApiService } from '@tools-state/theme/theme-api.service';
import { ColorChange } from '@tools-state/theme/theme.models';
import { fromTheme } from '@tools-state/theme/theme.reducer';
import { getActiveTheme } from '@tools-state/theme/theme.selectors';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  constructor(
    private store: Store<fromTheme.State>,
    private themeApi: ThemeApiService,
    private painterApi: PainterApiService
  ) {
  }

  createTheme(themeInfo: { name: string; dark: boolean }): Observable<Theme> {
    return this.store.pipe(
      select(getActiveProjectId),
      take(1),
      mergeMap((projectId: string) => this.themeApi.createTheme(projectId, themeInfo))
    );
  }

  deleteTheme(id: string): Observable<Theme> {
    return this.themeApi.deleteTheme(id);
  }

  renameTheme(data: { newName: string; id: string }): Observable<any> {
    return this.themeApi.renameTheme(data.id, data.newName);
  }

  updateRadius(radius: { value: number; unit: string }): Observable<Update<Theme>> {
    return this.store.pipe(
      select(getActiveTheme),
      take(1),
      map((theme: Theme) => ({ id: theme.id, changes: { radius } }))
    );
  }

  updateShadow(shadowEnabled: boolean): Observable<Update<Theme>> {
    return this.store.pipe(
      select(getActiveTheme),
      take(1),
      map((theme: Theme) => ({
        id: theme.id,
        changes: { shadow: this.computeShadow(shadowEnabled, theme.dark, theme.colors.basic) }
      }))
    );
  }

  updateFont(font: ThemeFont): Observable<Update<Theme>> {
    return this.store.pipe(
      select(getActiveTheme),
      take(1),
      map((theme: Theme) => ({ id: theme.id, changes: { font } }))
    );
  }

  lockColor(name: string, locked: boolean): Observable<Update<Theme>> {
    return this.store.pipe(
      select(getActiveTheme),
      take(1),
      map((theme: Theme) => ({
        id: theme.id,
        changes: { colors: { ...theme.colors, [name]: { ...theme.colors[name], locked } } }
      }))
    );
  }

  updatePrimary(colorChange: ColorChange): Observable<Update<Theme>> {
    return combineLatest([
      this.store.pipe(select(getActiveTheme)),
      this.painterApi.generateSupport(colorChange.color)
    ]).pipe(
      take(1),
      map(([theme, colors]: [Theme, Partial<ThemeColors>]) => ({
        id: theme.id,
        changes: this.getGeneratedColorsChanges(theme, colors, true)
      }))
    );
  }

  refreshSupport(): Observable<Update<Theme>> {
    return this.store.pipe(
      select(getActiveTheme),
      take(1),
      mergeMap((t: Theme) => this.painterApi.generateSupport(t.colors.primary._500).pipe(map(colors => [t, colors]))),
      map(([theme, colors]: [Theme, Partial<ThemeColors>]) => ({
        id: theme.id,
        changes: this.getGeneratedColorsChanges(theme, colors, false)
      }))
    );
  }

  updateShadedColor(name: string, value: ColorChange, count: number): Observable<Update<Theme>> {
    return combineLatest([
      this.painterApi.generateShades(value.color, count),
      this.store.pipe(select(getActiveTheme))
    ]).pipe(
      take(1),
      map(([shadedColor, theme]: [ShadedColor, Theme]) => ({
        id: theme.id,
        changes: { ...theme, colors: { ...theme.colors, [name]: shadedColor } }
      }))
    );
  }

  computeShadow(shadowEnabled: boolean, themeDark: boolean, basicColor: ExtendedShadedColor) {
    if (shadowEnabled) {
      return themeDark ? this.getDarkShadow(basicColor) : this.getLightShadow(basicColor);
    }
    return 'none';
  }

  private getGeneratedColorsChanges(
    theme: Theme,
    colors: Partial<ThemeColors>,
    updatePrimary: boolean
  ): Partial<Theme> {
    const changes = { colors: { ...theme.colors } };
    for (const colorName in colors) {
      if (!theme.colors[colorName].locked) {
        changes.colors[colorName] = colors[colorName];
      }
    }
    if (!updatePrimary) {
      changes.colors.primary = theme.colors.primary;
    }
    return changes;
  }

  private getLightShadow(basicColor: ExtendedShadedColor): string {
    return `0 0.5rem 1rem 0 ${this.hexToRgba(basicColor._700, 0.1)}`;
  }

  private getDarkShadow(basicColor: ExtendedShadedColor): string {
    return `0 0.5rem 1rem 0 ${basicColor._900}`;
  }

  private hexToRgba(hex: string, opacity: number): string {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}
