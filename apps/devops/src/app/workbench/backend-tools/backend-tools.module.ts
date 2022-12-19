import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SentryErrorHandler, Theme } from '@common';
import { PrivilegesEvaluatorDataSource } from '@core/acl/privileges-evaluator-data-source';
import { UiModule } from '@devops-tools/ui';
import { TriAlertModule } from '@gradii/triangle/alert';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCardModule } from '@gradii/triangle/card';
import { TriDialogModule } from '@gradii/triangle/dialog';
import { TriFormModule } from '@gradii/triangle/form';
import { TriInputModule } from '@gradii/triangle/input';
import { TriListModule } from '@gradii/triangle/list';
import { EffectsNgModule } from '@ngneat/effects-ng';
import { ToolsSharedModule } from '@tools-shared/tools-shared.module';
import { PageFacade } from '@tools-state/page/page-facade.service';
import { Page } from '@tools-state/page/page.model';
import { ThemeFacade } from '@tools-state/theme/theme-facade.service';
import { ToolsEffects } from '@tools-state/tools.effects';
import { WorkflowBackendModule } from '@workflow-backend/workflow-backend.module';
import { BackendToolsComponent } from './backend-tools.component';
import { BackendToolsRoutingModule } from './backend-tools.routing.module';
import { ConfigUiCronComponent } from './config-ui-cron/config-ui-cron.component';
import { ConfigWorkflowComponent } from './config-workflow/config-workflow.component';
import { DeployLogComponent } from './deploy-log/deploy-log.component';
import { DeployPopupComponent } from './deploy-popup/deploy-popup.component';
import { DeployServiceDialogComponent } from './deploy-service-dialog/deploy-service-dialog.component';
import { ProjectPreloadResolver } from './project-preload-resolver.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BackendToolsRoutingModule,
    ReactiveFormsModule,

    // StoreModule.forFeature('tools', fromTools.reducers, { metaReducers: fromTools.storeConfig.metaReducers }),
    EffectsNgModule.forFeature(ToolsEffects),

    ToolsSharedModule,

    //ui
    WorkflowBackendModule,

    //common

    UiModule,

    TriButtonModule,
    TriAlertModule,
    TriFormModule,
    TriDialogModule,
    TriCardModule,
    TriInputModule,
    TriListModule
  ],
  declarations: [
    BackendToolsComponent,
    ConfigUiCronComponent,
    ConfigWorkflowComponent,
    DeployPopupComponent,
    DeployLogComponent,
    DeployServiceDialogComponent
  ],
  exports: [
    BackendToolsComponent,
    ConfigUiCronComponent,
    ConfigWorkflowComponent,
    DeployPopupComponent,
    DeployLogComponent,
    DeployServiceDialogComponent
  ],
  providers   : [{ provide: ErrorHandler, useClass: SentryErrorHandler }, ProjectPreloadResolver]
})
export class BackendToolsModule {
  constructor(pageFacade: PageFacade, themeFacade: ThemeFacade, roleEvaluator: PrivilegesEvaluatorDataSource) {
    pageFacade.pageList$.subscribe((pages: Page[]) => roleEvaluator.pages$.next(pages));
    themeFacade.themeList$.subscribe((themes: Theme[]) => roleEvaluator.themes$.next(themes));
  }
}
