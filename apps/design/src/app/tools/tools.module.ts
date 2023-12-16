import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogModule,
  NbIconModule,
  NbLayoutModule,
  NbListModule,
  NbPopoverModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbTooltipModule,
  NbUserModule
} from '@nebular/theme';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BakeryCommonModule, SentryErrorHandler, Theme } from '@common';
import { ReactiveFormsModule } from '@angular/forms';

import { fromTools } from '@tools-state/tools.reducer';
import { ToolsEffects } from '@tools-state/tools.effects';
import { PageFacade } from '@tools-state/page/page-facade.service';
import { Page } from '@tools-state/page/page.model';
import { ToolsSharedModule } from '@tools-shared/tools-shared.module';
import { ThemeFacade } from '@tools-state/theme/theme-facade.service';
import { TutorialSharedModule } from '@shared/tutorial/tutorial-shared.module';
import { TutorialDialogModule } from '@shared/tutorial-dialog/tutorial-dialog.module';
import { PrivilegesEvaluatorDataSource } from '@core/acl/privileges-evaluator-data-source';

import { DataNotificationComponent } from './layout/data-notification/data-notification.component';
import { HeaderComponent } from './layout/header.component';
import { LayoutComponent } from './layout/layout.component';
import { PreviewLinkComponent } from './layout/preview-link.component';
import { ShareButtonComponent, SharePopupComponent } from './layout/share.component';
import { ToggleStructurePanelComponent } from './layout/toggle-structure/toggle-structure-panel.component';
import { ToolsRoutingModule } from './tools-routing.module';
import { ToolsComponent } from './tools.component';
import { WorkingAreaComponent } from './working-area/working-area.component';
import { DownloadComponent } from './layout/download/download.component';
import { ToolsMenuComponent } from './layout/tools-menu.component';
import { NotFoundModule } from '../not-found/not-found.module';
import { LearnMenuComponent } from './layout/learn-menu.component';
import { VideoTutorialDialogComponent } from './layout/video-tutorial/video-tutorial-dialog.component';
import { VideoTutorialService } from './layout/video-tutorial/video-tutorial.service';
import { BreakpointSwitchComponent } from './layout/breakpoints/breakpoint-switch.component';
import { BreakpointsContainerComponent } from './layout/breakpoints/breakpoints-container.component';
import { BreakpointWidthIndicatorComponent } from './layout/breakpoints/breakpoint-width-indicator.component';
import { HistoryComponent } from './layout/history.component';
import { TutorialsModule } from './tutorial/tutorials.module';
import { VideoTutorialPlayerComponent } from './layout/video-tutorial/video-tutorial-player.component';
import { VideoTutorialPlaylistComponent } from './layout/video-tutorial/video-tutorial-playlist.component';
import { ProjectPreloadResolver } from './project-preload-resolver.service';
import { TutorialModeContainerComponent } from './layout/tutorial-mode/tutorial-mode-container.component';
import { TutorialModeComponent } from './layout/tutorial-mode/tutorial-mode.component';
import { WorkflowModule } from './workflow/workflow.module';
import { WorkflowStateManagerButtonComponent } from './layout/workflow-state-manager/workflow-state-manager-button.component';
import { SettingsService } from '@tools-state/settings/settings.service';
import { DeployComponent } from './layout/hosting/deploy.component';
import { DeployPopupComponent } from './layout/hosting/deploy-popup.component';
import { DeployPopupItemComponent } from './layout/hosting/deploy-popup-item.component';
import { DownloadPopupComponent } from './layout/download/download-popup.component';
import { DataUnavailabilityNoticeComponent } from './layout/data-unavailability-notice/data-unavailability-notice.component';

@NgModule({
  declarations: [
    ToolsComponent,
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
    LearnMenuComponent,
    VideoTutorialDialogComponent,
    BreakpointWidthIndicatorComponent,
    HistoryComponent,
    VideoTutorialPlayerComponent,
    VideoTutorialPlaylistComponent,
    TutorialModeComponent,
    TutorialModeContainerComponent,
    DataNotificationComponent,
    WorkflowStateManagerButtonComponent,
    DataUnavailabilityNoticeComponent
  ],
  imports: [
    CommonModule,
    ToolsRoutingModule,
    BakeryCommonModule,
    ReactiveFormsModule,
    NbLayoutModule,
    NbSidebarModule,
    NbUserModule,
    NbSpinnerModule,
    NbButtonModule,
    NbCheckboxModule,
    NbPopoverModule,
    NbCardModule,
    StoreModule.forFeature('tools', fromTools.reducers, { metaReducers: fromTools.storeConfig.metaReducers }),
    EffectsModule.forFeature(ToolsEffects),
    NbDialogModule.forChild(),
    NotFoundModule,
    NbIconModule,
    NbTooltipModule,
    TutorialsModule,
    TutorialSharedModule,
    TutorialDialogModule,
    ToolsSharedModule,
    WorkflowModule,
    NbListModule
  ],
  providers: [{ provide: ErrorHandler, useClass: SentryErrorHandler }, VideoTutorialService, ProjectPreloadResolver],
  entryComponents: [VideoTutorialDialogComponent]
})
export class ToolsModule {
  constructor(pageFacade: PageFacade, themeFacade: ThemeFacade, roleEvaluator: PrivilegesEvaluatorDataSource) {
    pageFacade.pageList$.subscribe((pages: Page[]) => roleEvaluator.pages$.next(pages));
    themeFacade.themeList$.subscribe((themes: Theme[]) => roleEvaluator.themes$.next(themes));
  }
}
