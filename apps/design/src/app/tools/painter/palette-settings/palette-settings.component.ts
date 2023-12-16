import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnalyticsService, Theme } from '@common';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ColorChange } from '@tools-state/theme/theme.models';
import { ThemeFacade } from '@tools-state/theme/theme-facade.service';

@Component({
  selector: 'ub-palette-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-accordion multi>
      <nb-accordion-item expanded>
        <nb-accordion-item-header>PRIMARY COLOR</nb-accordion-item-header>
        <nb-accordion-item-body>
          <ub-primary-color
            [theme]="theme$ | async"
            [paletteLoading]="paletteLoading$ | async"
            [extendedSettingsAvailable]="extendedSettingsAvailable$ | async"
            (colorChange)="updatePrimary($event)"
          ></ub-primary-color>
        </nb-accordion-item-body>
      </nb-accordion-item>
      <nb-accordion-item expanded>
        <nb-accordion-item-header>SUPPORT COLORS</nb-accordion-item-header>
        <nb-accordion-item-body class="no-padding">
          <ub-support-colors
            [theme]="theme$ | async"
            [supportLoading]="supportLoading$ | async"
            [paletteLoading]="paletteLoading$ | async"
            [extendedSettingsAvailable]="extendedSettingsAvailable$ | async"
            (refresh)="refreshSupport()"
            (lockColor)="lockColor($event)"
            (colorChange)="updateSupport($event)"
          ></ub-support-colors>
        </nb-accordion-item-body>
      </nb-accordion-item>
      <nb-accordion-item expanded>
        <nb-accordion-item-header>BASIC COLOR</nb-accordion-item-header>
        <nb-accordion-item-body>
          <ub-basic-color
            [theme]="theme$ | async"
            [extendedSettingsAvailable]="extendedSettingsAvailable$ | async"
            [paletteLoading]="paletteLoading$ | async"
            (colorChange)="updateBasic($event)"
          ></ub-basic-color>
        </nb-accordion-item-body>
      </nb-accordion-item>
      <nb-accordion-item expanded>
        <nb-accordion-item-header>OTHER COLORS</nb-accordion-item-header>
        <nb-accordion-item-body class="no-padding">
          <ub-other-colors [theme]="theme$ | async"></ub-other-colors>
        </nb-accordion-item-body>
      </nb-accordion-item>
    </nb-accordion>
  `
})
export class PaletteSettingsComponent {
  theme$: Observable<Theme> = this.themeFacade.activeTheme$;
  supportLoading$: Observable<boolean> = this.themeFacade.supportLoading$;
  paletteLoading$: Observable<boolean> = this.themeFacade.paletteLoading;
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
