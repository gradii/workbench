import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BakeryCommonModule, SentryErrorHandler, Theme } from '@common';
import { PrivilegesEvaluatorDataSource } from '@core/acl/privileges-evaluator-data-source';
import { DatabaseBuilderModule } from '@database-builder/database-builder.module';
import { REIKI_SVG_ICONS, WORKBENCH_SVG_ICONS } from '@gradii/triangle-icons/workbench';
import { TriBadgeModule } from '@gradii/triangle/badge';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCardModule } from '@gradii/triangle/card';
import { TriCheckboxModule } from '@gradii/triangle/checkbox';
import { TriDividerModule } from '@gradii/triangle/divider';
import { IconRegistry, TriIconModule } from '@gradii/triangle/icon';
import { TriLayoutModule } from '@gradii/triangle/layout';
import { TriListModule } from '@gradii/triangle/list';
import { TriNavbarModule } from '@gradii/triangle/navbar';
import { TriPopoverModule } from '@gradii/triangle/popover';
import { TriTooltipModule } from '@gradii/triangle/tooltip';
import { KitchenModule } from '@kitchen';
import { EffectsNgModule } from '@ngneat/effects-ng';
import { ToolsSharedModule } from '@tools-shared/tools-shared.module';
import { PageFacade } from '@tools-state/page/page-facade.service';
import { Page } from '@tools-state/page/page.model';
import { ThemeFacade } from '@tools-state/theme/theme-facade.service';
import { ToolsEffects } from '@tools-state/tools.effects';

import { fromTools } from '@tools-state/tools.reducer';
import { WorkflowFrontendModule } from '@workflow-frontend/workflow-frontend.module';
import { metaReducerEffect } from '@tools-state/meta/meta-reducers';
import { DesignToolsComponent } from './design-tools.component';
import { DesignToolsRoutingModule } from './design-tools.routing.module';
import { BreakpointSwitchComponent } from './layout/breakpoints/breakpoint-switch.component';
import { BreakpointWidthIndicatorComponent } from './layout/breakpoints/breakpoint-width-indicator.component';
import { BreakpointsContainerComponent } from './layout/breakpoints/breakpoints-container.component';

import { DataNotificationComponent } from './layout/data-notification/data-notification.component';
import { DownloadPopupComponent } from './layout/download/download-popup.component';
import { DownloadComponent } from './layout/download/download.component';
import { HeaderComponent } from './layout/header.component';
import { HistoryComponent } from './layout/history.component';
import { DeployPopupItemComponent } from './layout/hosting/deploy-popup-item.component';
import { DeployPopupComponent } from './layout/hosting/deploy-popup.component';
import { DeployComponent } from './layout/hosting/deploy.component';
import { LayoutComponent } from './layout/layout.component';
import { PreviewLinkComponent } from './layout/preview-link.component';
import { ShareButtonComponent, SharePopupComponent } from './layout/share.component';
import { ToggleStructurePanelComponent } from './layout/toggle-structure/toggle-structure-panel.component';
import { ToolsMenuComponent } from './layout/tools-menu.component';
import {
  WorkflowStateManagerButtonComponent
} from './layout/workflow-state-manager/workflow-state-manager-button.component';
import { ProjectPreloadResolver } from './project-preload-resolver.service';
import { WorkingAreaComponent } from './working-area/working-area.component';

@NgModule({
  declarations: [
    DesignToolsComponent,
    ToolsMenuComponent,

    WorkingAreaComponent,

    BreakpointsContainerComponent,
    BreakpointSwitchComponent,
    HeaderComponent,
    LayoutComponent,
    DownloadComponent,
    DeployComponent,
    DeployPopupComponent,
    DeployPopupItemComponent,
    DownloadPopupComponent,
    PreviewLinkComponent,
    SharePopupComponent,
    ShareButtonComponent,
    ToggleStructurePanelComponent,

    BreakpointWidthIndicatorComponent,
    HistoryComponent,

    DataNotificationComponent,
    WorkflowStateManagerButtonComponent,
  ],
  imports: [
    CommonModule,

    KitchenModule,

    DesignToolsRoutingModule,
    BakeryCommonModule,
    ReactiveFormsModule,
    EffectsNgModule.forFeature(fromTools.reducerEffects),
    // StoreModule.forFeature('tools', fromTools.reducers, { metaReducers: fromTools.storeConfig.metaReducers }),
    EffectsNgModule.forFeature(metaReducerEffect),
    EffectsNgModule.forFeature(ToolsEffects),
    // NotFoundModule,
    ToolsSharedModule,
    DatabaseBuilderModule,
    WorkflowFrontendModule,

    TriIconModule,
    TriButtonModule,
    TriTooltipModule,
    TriNavbarModule,
    TriLayoutModule,
    TriPopoverModule,
    TriCheckboxModule,
    TriListModule,
    TriCardModule,
    TriBadgeModule,
    TriDividerModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: SentryErrorHandler,
    },
    ProjectPreloadResolver,
  ],
})
export class DesignToolsModule{
  constructor(
    pageFacade: PageFacade,
    themeFacade: ThemeFacade,
    roleEvaluator: PrivilegesEvaluatorDataSource,
    iconRegistry: IconRegistry,
    sanitizer: DomSanitizer
  ) {
    pageFacade.pageList$.subscribe((pages: Page[]) =>
      roleEvaluator.pages$.next(pages)
    );
    themeFacade.themeList$.subscribe((themes: Theme[]) =>
      roleEvaluator.themes$.next(themes)
    );

    iconRegistry.addSvgIconSetLiteralInNamespace(
      'reiki',
      sanitizer.bypassSecurityTrustHtml(REIKI_SVG_ICONS)
    );
    iconRegistry.addSvgIconSetLiteralInNamespace(
      'workbench',
      sanitizer.bypassSecurityTrustHtml(WORKBENCH_SVG_ICONS)
    );
  }
}
