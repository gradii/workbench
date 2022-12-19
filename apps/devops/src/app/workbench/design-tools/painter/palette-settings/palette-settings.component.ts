import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnalyticsService, Theme } from '@common';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ColorChange } from '@tools-state/theme/theme.models';
import { ThemeFacade } from '@tools-state/theme/theme-facade.service';

@Component({
  selector       : 'len-palette-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-accordion multi>
      <tri-accordion-item title="PRIMARY COLOR">
        <len-primary-color
          [theme]="theme$ | async"
          [paletteLoading]="paletteLoading$ | async"
          [extendedSettingsAvailable]="extendedSettingsAvailable$ | async"
          (colorChange)="updatePrimary($event)"
        ></len-primary-color>
      </tri-accordion-item>
      <tri-accordion-item title="SUPPORT COLORS">
        <len-support-colors
          [theme]="theme$ | async"
          [supportLoading]="supportLoading$ | async"
          [paletteLoading]="paletteLoading$ | async"
          [extendedSettingsAvailable]="extendedSettingsAvailable$ | async"
          (refresh)="refreshSupport()"
          (lockColor)="lockColor($event)"
          (colorChange)="updateSupport($event)"
        ></len-support-colors>
      </tri-accordion-item>
      <tri-accordion-item title="BASIC COLOR">
        <len-basic-color
          [theme]="theme$ | async"
          [extendedSettingsAvailable]="extendedSettingsAvailable$ | async"
          [paletteLoading]="paletteLoading$ | async"
          (colorChange)="updateBasic($event)"
        ></len-basic-color>
      </tri-accordion-item>
      <tri-accordion-item title="OTHER COLORS">
        <len-other-colors [theme]="theme$ | async"></len-other-colors>
      </tri-accordion-item>
    </tri-accordion>
  `
})
export class PaletteSettingsComponent {
  theme$: Observable<Theme>                       = this.themeFacade.activeTheme$;
  supportLoading$: Observable<boolean>            = this.themeFacade.supportLoading$;
  paletteLoading$: Observable<boolean>            = this.themeFacade.paletteLoading;
  extendedSettingsAvailable$: Observable<boolean> = this.themeFacade.extendedSettingsAvailable$;

  constructor(private themeFacade: ThemeFacade, private analytics: AnalyticsService) {
  }

  updatePrimary(color: ColorChange) {
    this.themeFacade.updatePrimary(color);

    // inputSource is undefined if user just opened modal, did nothing and pressed done.
    if (color.inputSource) {
      this.analytics.logPrimarySelected(color.inputSource, color.color);
    }
  }

  updateBasic(color: ColorChange) {
    this.themeFacade.updateBasic(color);
    this.analytics.logBackgroundChange(color.color);
  }

  updateSupport(color: { name: string; value: ColorChange }) {
    this.themeFacade.updateSupport(color.name, color.value);
  }

  refreshSupport() {
    this.themeFacade.refreshSupport();
    this.analytics.logRegenerateColors();
  }

  lockColor(lockInfo: { name: string; locked: boolean }) {
    this.themeFacade.lockColor(lockInfo.name, lockInfo.locked);

    if (lockInfo.locked) {
      this.theme$.pipe(take(1)).subscribe((theme: Theme) => {
        const code: string = theme.colors[lockInfo.name]._500;
        this.analytics.logLockColor(lockInfo.name, code);
      });
    }
  }
}
