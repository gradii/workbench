import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnalyticsService, Theme } from '@common';
import { Observable } from 'rxjs';

import { ThemeFacade } from '@tools-state/theme/theme-facade.service';

@Component({
  selector: 'ub-shape-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-accordion multi>
      <nb-accordion-item expanded>
        <nb-accordion-item-header>BORDER RADIUS</nb-accordion-item-header>
        <nb-accordion-item-body>
          <ub-radius-settings
            [radius]="(theme$ | async).radius.value"
            [unit]="(theme$ | async).radius.unit"
            [extendedSettingsAvailable]="extendedSettingsAvailable$ | async"
            (radiusChange)="updateRadius($event)"
          ></ub-radius-settings>
        </nb-accordion-item-body>
      </nb-accordion-item>
      <nb-accordion-item expanded>
        <nb-accordion-item-header>SHADOWS</nb-accordion-item-header>
        <nb-accordion-item-body>
          <ub-shadow-settings
            [theme]="theme$ | async"
            [extendedSettingsAvailable]="extendedSettingsAvailable$ | async"
            (shadowChange)="updateShadow($event)"
          ></ub-shadow-settings>
        </nb-accordion-item-body>
      </nb-accordion-item>
    </nb-accordion>
  `
})
export class ShapeSettingsComponent {
  theme$: Observable<Theme> = this.themeFacade.activeTheme$;
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
