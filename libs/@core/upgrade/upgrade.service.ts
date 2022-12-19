import { Injectable, Injector } from '@angular/core';
import { AnalyticsService } from '@common/public-api';
import { UpgradeTemplateDialogComponent } from './upgrade-template-dialog.component';

import { UpgradeWidgetDialogComponent } from './upgrade-widget-dialog.component';
import { UpgradePainterDialogComponent } from './upgrade-painter-dialog.component';
import { UpgradePagesDialogComponent } from '@core/upgrade/upgrade-pages-dialog.component';
import { environment } from '@environments';
import { UserService } from '@auth/user.service';
import { TriDialogService } from '@gradii/triangle/dialog';

@Injectable({ providedIn: 'root' })
export class UpgradeService {
  constructor(
    private dialogService: TriDialogService,
    private analyticsService: AnalyticsService,
    private injector: Injector
  ) {
  }

  accessWidgetRequest(widgetName: string): void {
    this.saveTriedPaidFunctionalityMailSentNotification();
    this.analyticsService.logUpgradeRequest('widget', widgetName);
    this.dialogService.open(UpgradeWidgetDialogComponent);
  }

  accessTemplateRequest(templateName: string): void {
    this.saveTriedPaidFunctionalityMailSentNotification();
    this.analyticsService.logUpgradeRequest('template', templateName);
    this.dialogService.open(UpgradeTemplateDialogComponent);
  }

  accessThemeRequest(): void {
    this.saveTriedPaidFunctionalityMailSentNotification();
    this.analyticsService.logUpgradeRequest('painter');
    this.dialogService.open(UpgradePainterDialogComponent);
  }

  accessNewPageRequest(): void {
    this.saveTriedPaidFunctionalityMailSentNotification();
    this.analyticsService.logUpgradeRequest('page');
    this.dialogService.open(UpgradePagesDialogComponent);
  }

  private saveTriedPaidFunctionalityMailSentNotification(): void {
    if (environment.formBuilder) {
      return;
    }

    const userService: UserService = this.injector.get(UserService);

    if (!userService) {
      return;
    }

    // userService.saveTriedPaidFunctionalityMailSentNotification();
  }
}
