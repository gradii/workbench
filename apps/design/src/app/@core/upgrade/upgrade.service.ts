import { Injectable, Injector } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AnalyticsService } from '@common';
import { UpgradeTemplateDialogComponent } from './upgrade-template-dialog.component';

import { UpgradeWidgetDialogComponent } from './upgrade-widget-dialog.component';
import { UpgradePainterDialogComponent } from './upgrade-painter-dialog.component';
import { UpgradePagesDialogComponent } from '@core/upgrade/upgrade-pages-dialog.component';
import { environment } from '../../../environments/environment';
import { UserService } from '@auth/user.service';

@Injectable({ providedIn: 'root' })
export class UpgradeService {
  constructor(
    private dialogService: NbDialogService,
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

    userService.saveTriedPaidFunctionalityMailSentNotification();
  }
}
