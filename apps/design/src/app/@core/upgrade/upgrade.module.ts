import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbDialogModule } from '@nebular/theme';

import { UpgradeTemplateDialogComponent } from './upgrade-template-dialog.component';
import { UpgradeWidgetDialogComponent } from './upgrade-widget-dialog.component';
import { UpgradePagesDialogComponent } from '@core/upgrade/upgrade-pages-dialog.component';
import { UpgradePainterDialogComponent } from './upgrade-painter-dialog.component';

@NgModule({
  declarations: [
    UpgradeWidgetDialogComponent,
    UpgradeTemplateDialogComponent,
    UpgradePagesDialogComponent,
    UpgradePainterDialogComponent
  ],
  imports: [CommonModule, RouterModule, NbCardModule, NbButtonModule, NbDialogModule],
  entryComponents: [
    UpgradeWidgetDialogComponent,
    UpgradeTemplateDialogComponent,
    UpgradePagesDialogComponent,
    UpgradePainterDialogComponent
  ]
})
export class UpgradeModule {
}
