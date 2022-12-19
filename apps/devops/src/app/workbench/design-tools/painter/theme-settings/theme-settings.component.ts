import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { AnalyticsService, Theme } from '@common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ThemeFacade } from '@tools-state/theme/theme-facade.service';

@Component({
  selector: 'len-theme-settings',
  styleUrls: ['./theme-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="theme-header">
      <span class="theme-name">{{ (theme$ | async).name }}</span>
      <button triButton ghost size="tiny" class="basic back-button" (click)="back.emit()">
        Themes
        <tri-icon svgIcon="outline:right"></tri-icon>
      </button>
    </div>
    <tri-tab-group class="icon-tabs" class="tabs" fullWidth>
      <tri-tab title="color-palette">
        <div *ngIf="upgradeAvailable$ | async" class="upgrade-link-container">
          <a
            triButton
            fullWidth
            size="small"
            color="success"
            (click)="logUpgradeRequest()"
            routerLink="/settings/billing"
            >UPGRADE PAINTER</a
          >
        </div>
        <len-palette-settings></len-palette-settings>
      </tri-tab>
      <tri-tab tabIcon="brush">
        <div *ngIf="upgradeAvailable$ | async" class="upgrade-link-container">
          <a
            triButton
            fullWidth
            size="small"
            color="success"
            (click)="logUpgradeRequest()"
            routerLink="/settings/billing"
            >UPGRADE PAINTER</a
          >
        </div>
        <len-shape-settings></len-shape-settings>
      </tri-tab>
      <tri-tab title="text">
        <len-theme-text-settings></len-theme-text-settings>
      </tri-tab>
      <tri-tab title="heart">
        <div class="coming-soon-label">Coming soon</div>
      </tri-tab>
    </tri-tab-group>
  `
})
export class ThemeSettingsComponent {
  theme$: Observable<Theme> = this.themeFacade.activeTheme$;
  @Output() back: EventEmitter<void> = new EventEmitter<void>();
  upgradeAvailable$: Observable<boolean> = this.themeFacade.extendedSettingsAvailable$.pipe(
    map((notFreePlan: boolean) => !notFreePlan)
  );

  constructor(private themeFacade: ThemeFacade, private analytics: AnalyticsService) {
  }

  logUpgradeRequest(): void {
    this.analytics.logUpgradeRequest('theme');
  }
}
