import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { AnalyticsService, Theme } from '@common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ThemeFacade } from '@tools-state/theme/theme-facade.service';

@Component({
  selector: 'ub-theme-settings',
  styleUrls: ['./theme-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="theme-header">
      <span class="theme-name">{{ (theme$ | async).name }}</span>
      <button nbButton ghost size="tiny" class="basic back-button" (click)="back.emit()">
        Themes
        <nb-icon icon="chevron-right"></nb-icon>
      </button>
    </div>
    <nb-tabset class="icon-tabs" class="tabs" fullWidth>
      <nb-tab tabIcon="color-palette">
        <div *ngIf="upgradeAvailable$ | async" class="upgrade-link-container">
          <a
            nbButton
            fullWidth
            size="small"
            status="success"
            (click)="logUpgradeRequest()"
            routerLink="/settings/billing"
            >UPGRADE PAINTER</a
          >
        </div>
        <ub-palette-settings></ub-palette-settings>
      </nb-tab>
      <nb-tab tabIcon="brush">
        <div *ngIf="upgradeAvailable$ | async" class="upgrade-link-container">
          <a
            nbButton
            fullWidth
            size="small"
            status="success"
            (click)="logUpgradeRequest()"
            routerLink="/settings/billing"
            >UPGRADE PAINTER</a
          >
        </div>
        <ub-shape-settings></ub-shape-settings>
      </nb-tab>
      <nb-tab tabIcon="text">
        <ub-theme-text-settings></ub-theme-text-settings>
      </nb-tab>
      <nb-tab tabIcon="heart">
        <div class="coming-soon-label">Coming soon</div>
      </nb-tab>
    </nb-tabset>
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
