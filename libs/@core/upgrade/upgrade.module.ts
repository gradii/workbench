import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpgradePagesDialogComponent } from '@core/upgrade/upgrade-pages-dialog.component';
import { TriCardModule } from '@gradii/triangle/card';
import { TriDialogModule } from '@gradii/triangle/dialog';
import { UpgradePainterDialogComponent } from './upgrade-painter-dialog.component';

import { UpgradeTemplateDialogComponent } from './upgrade-template-dialog.component';
import { UpgradeWidgetDialogComponent } from './upgrade-widget-dialog.component';
import { TriButtonModule } from '@gradii/triangle/button';

@NgModule({
  declarations: [
    UpgradeWidgetDialogComponent,
    UpgradeTemplateDialogComponent,
    UpgradePagesDialogComponent,
    UpgradePainterDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    TriCardModule,
    TriButtonModule,
    TriDialogModule
  ]
})
export class UpgradeModule {
}
