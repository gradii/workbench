import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnalyticsService, Theme } from '@common';
import { Observable } from 'rxjs';

import { ThemeFacade } from '@tools-state/theme/theme-facade.service';

@Component({
  selector       : 'len-shape-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-accordion multi>
      <tri-accordion-item title="BORDER RADIUS">
        <len-radius-settings
          [radius]="(theme$ | async).radius.value"
          [unit]="(theme$ | async).radius.unit"
          [extendedSettingsAvailable]="extendedSettingsAvailable$ | async"
          (radiusChange)="updateRadius($event)"
        ></len-radius-settings>
      </tri-accordion-item>
      <tri-accordion-item title="SHADOWS">
        <len-shadow-settings
          [theme]="theme$ | async"
          [extendedSettingsAvailable]="extendedSettingsAvailable$ | async"
          (shadowChange)="updateShadow($event)"
        ></len-shadow-settings>
      </tri-accordion-item>
    </tri-accordion>
  `
})
export class ShapeSettingsComponent {
  theme$: Observable<Theme>                       = this.themeFacade.activeTheme$;
  extendedSettingsAvailable$: Observable<boolean> = this.themeFacade.extendedSettingsAvailable$;

  constructor(private themeFacade: ThemeFacade, private analytics: AnalyticsService) {
  }

  updateRadius(radius: { value: number; unit: string }) {
    this.themeFacade.updateRadius(radius);
    this.analytics.logChangeBorderRadius(radius.value, radius.unit);
  }

  updateShadow(shadowEnabled: boolean) {
    this.themeFacade.updateShadow(shadowEnabled);
  }
}
