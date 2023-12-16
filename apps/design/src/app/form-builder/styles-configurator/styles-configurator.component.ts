import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { AnalyticsService, ColorInputSource, ShadedColor, Theme } from '@common';
import { StylesConfiguratorService } from './styles-configurator.service';
import { TemplateChanges, ThemeChanges } from '../app-changes';
import { ColorChange } from '@tools-state/theme/theme.models';

@Component({
  selector: 'app-styles-configurator',
  templateUrl: './styles-configurator.component.html',
  styleUrls: ['./styles-configurator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StylesConfiguratorComponent {
  primary: ShadedColor;
  success: ShadedColor;
  danger: ShadedColor;
  info: ShadedColor;
  warning: ShadedColor;
  _theme: Theme;

  loading = false;

  currentColorChange: ColorChange;

  @Input() set theme(theme: Theme) {
    this._theme = theme;
    this.primary = theme.colors.primary;
    this.success = theme.colors.success;
    this.danger = theme.colors.danger;
    this.info = theme.colors.info;
    this.warning = theme.colors.warning;
  }

  @Output() changeTemplate = new EventEmitter<TemplateChanges>();

  constructor(
    private stylesConfiguratorService: StylesConfiguratorService,
    private analyticsService: AnalyticsService,
    private cd: ChangeDetectorRef
  ) {
  }

  setColorChange(color: string, source: string, logo: string, fromInput?: boolean) {
    this.currentColorChange = { color, inputSource: source as ColorInputSource, logo };
    if (fromInput) {
      this.changeColor();
    }
  }

  changeColor(event?: ColorChange) {
    this.analyticsService.logFormBuilderConfigColors();
    if (!event) {
      event = this.currentColorChange;
    }

    this.setLoading(true);
    this.stylesConfiguratorService
      .updatePrimary({ inputSource: ColorInputSource.INPUT, ...event }, this._theme)
      .subscribe(
        res => {
          this.setLoading(false);
          this.emitChanges(res.changes);
        },
        () => {
          this.setLoading(false);
        }
      );
  }

  private setLoading(status: boolean) {
    this.loading = status;
    this.cd.detectChanges();
  }

  private emitChanges(change: ThemeChanges) {
    this.changeTemplate.emit({ themeChanges: change });
  }
}
