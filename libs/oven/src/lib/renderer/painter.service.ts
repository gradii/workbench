import { OvenApp, ShadedColor, Theme } from '@common';
import { Inject, Injectable } from '@angular/core';
import { NB_DOCUMENT, NbJSThemesRegistry, NbThemeService } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';

import { RenderState } from '../state/render-state.service';
import { PainterTextService } from './painter-text.service';

@Injectable({ providedIn: 'root' })
export class PainterService {
  private destroyed: Subject<void> = new Subject<void>();

  private $theme: Observable<Theme> = this.renderState.app$.pipe(
    map((app: OvenApp) => app.theme),
    filter((theme: Theme) => !!theme),
    distinctUntilChanged((theme1, theme2) => JSON.stringify(theme1) === JSON.stringify(theme2)),
    takeUntil(this.destroyed)
  );

  constructor(
    private renderState: RenderState,
    @Inject(NB_DOCUMENT) protected document,
    private themeRegistry: NbJSThemesRegistry,
    private themeService: NbThemeService,
    private painterTextService: PainterTextService
  ) {
  }

  attach() {
    this.$theme.subscribe((theme: Theme) => this.updateTheme(theme));
  }

  detach() {
    this.destroyed.next();
  }

  updateVariable(varName: string, varValue: string) {
    this.document.body.style.setProperty(varName, varValue);
  }

  private updateTheme(theme: Theme) {
    const varList: { name: string; value: string }[] = this.themeToVarList(theme);
    for (const cssVar of varList) {
      this.document.body.style.setProperty(cssVar.name, cssVar.value);
    }
    this.udpateJsTheme(theme);
    this.painterTextService.updateFont(theme);
    this.themeService.changeTheme(theme.dark ? 'dark' : 'default');
  }

  private themeToVarList(theme: Theme): { name: string; value: string }[] {
    const varList: { name: string; value: string }[] = [];
    varList.push({ name: '--border-radius', value: theme.radius.value + theme.radius.unit });
    varList.push({ name: '--shadow', value: theme.shadow });
    varList.push(...this.shadedColorToVarList('--color-primary', theme.colors.primary));
    varList.push(...this.shadedColorToVarList('--color-info', theme.colors.info));
    varList.push(...this.shadedColorToVarList('--color-success', theme.colors.success));
    varList.push(...this.shadedColorToVarList('--color-warning', theme.colors.warning));
    varList.push(...this.shadedColorToVarList('--color-danger', theme.colors.danger));
    varList.push(...this.shadedColorToVarList('--color-basic', theme.colors.basic));
    varList.push(...this.getDevUIVarList(theme));
    return varList;
  }

  private getDevUIVarList(theme: Theme): { name: string; value: string }[] {
    const selectorColor: string = theme.dark ? '#768094' : '#b0b6c0';
    const spaceBorderColor: string = theme.dark ? '#898c97' : '#c5cbd6';
    const spaceSelectedBackgroundColor: string = theme.dark ? 'rgba(200,206,219,0.05)' : 'rgba(200,206,219,0.1)';
    return [
      { name: '--color-basic-500', value: '#d1d7e3' },
      { name: '--dev-ui-action-color', value: '#ffffff' },
      { name: '--dev-ui-hover-action-color', value: '#ffffff' },
      { name: '--dev-ui-action-background-color', value: '#ff856c' },
      { name: '--dev-ui-hover-background-action-color', value: '#ffab90' },
      { name: '--dev-ui-active-background-action-color', value: '#db5c4e' },
      { name: '--dev-ui-hover-breadcrumb-color', value: '#ffffff' },
      { name: '--dev-ui-hover-background-breadcrumb-color', value: '#1e89ef' },
      { name: '--dev-ui-selector-color', value: selectorColor },
      { name: '--dev-ui-space-border-color', value: spaceBorderColor },
      { name: '--dev-ui-space-selected-border-color', value: '#ff856c' },
      { name: '--dev-ui-component-border-color', value: '#ff856c' },
      { name: '--dev-ui-component-selected-border-color', value: '#ff856c' },
      { name: '--dev-ui-component-margin-background-color', value: '#47C256' },
      { name: '--dev-ui-component-data-background-color', value: '#8F5CFF' },
      { name: '--dev-ui-component-padding-background-color', value: '#1E88EF' },
      { name: '--dev-ui-space-hover-background-color', value: spaceSelectedBackgroundColor }
    ];
  }

  private shadedColorToVarList(name: string, color: ShadedColor): { name: string; value: string }[] {
    return Object.keys(color).map((colorKey: string) => {
      return { name: name + colorKey.replace('_', '-'), value: color[colorKey] };
    });
  }

  private udpateJsTheme(theme: Theme) {
    const name = theme.dark ? 'dark' : 'default';
    this.themeRegistry.register(
      {
        name,
        base: name,
        variables: {
          primary: theme.colors.primary._500,
          success: theme.colors.success._500,
          info: theme.colors.info._500,
          warning: theme.colors.warning._500,
          danger: theme.colors.danger._500,
          charts: {
            primary: theme.colors.primary._500,
            success: theme.colors.success._500,
            info: theme.colors.info._500,
            warning: theme.colors.warning._500,
            danger: theme.colors.danger._500,
            bg: 'transparent',
            textColor: theme.dark ? theme.colors.basic._100 : theme.colors.basic._900,
            axisLineColor: theme.colors.basic._600,
            splitLineColor: theme.dark ? theme.colors.basic._700 : theme.colors.basic._500,
            itemHoverShadowColor: 'rgba(0, 0, 0, 0.5)',
            tooltipBackgroundColor: theme.dark ? theme.colors.basic._1100 : theme.colors.basic._400,
            areaOpacity: '0.7'
          },
          bubbleMap: {
            primary: theme.colors.primary._500,
            success: theme.colors.success._500,
            info: theme.colors.info._500,
            warning: theme.colors.warning._500,
            danger: theme.colors.danger._500,
            titleColor: theme.dark ? theme.colors.basic._100 : theme.colors.basic._900,
            areaColor: theme.dark ? theme.colors.basic._700 : theme.colors.basic._500,
            areaHoverColor: theme.dark ? theme.colors.basic._600 : theme.colors.basic._600,
            areaBorderColor: theme.dark ? theme.colors.basic._900 : theme.colors.basic._400
          }
        }
      },
      name,
      name
    );
  }
}
