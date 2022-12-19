import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

import { UserFacade } from '@auth/user-facade.service';
import { UserService } from '@auth/user.service';
import { BuilderSidebarService } from '@builder/builder-sidebar.service';
import { DatabaseBuilderDialogService } from '@database-builder/dialog/database-builder-dialog.service';
import { PopoverDirective } from '@gradii/triangle/popover';
// import { VideoTutorialService } from './video-tutorial/video-tutorial.service';
import { HistoryFacadeService } from '@tools-state/history/history-facade.service';
import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { StateManagerDialogService } from '@workflow-common/state-manager/dialog/state-manager-dialog.service';
import { WorkflowFrontendDialogService } from '@workflow-frontend/dialog/workflow-frontend-dialog.service';
import { Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector       : 'len-tools-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./tools-menu.component.scss'],
  template       : `
    <div [triTooltip]="'Components'" triTooltipPosition="right">
      <a class="structure"
         (click)="toggleComponents()">
        <tri-icon svgIcon="outline:group"></tri-icon>
      </a>
    </div>
    <div [triTooltip]="'Structure'" triTooltipPosition="right">
      <a class="structure"
         (click)="toggleSettings()">
        <tri-icon svgIcon="workbench:layers"></tri-icon>
      </a>
    </div>

    <div [triTooltip]="'Builder'" triTooltipPosition="right">
      <a
        class="builder"
        title="Builder"
        routerLink="builder"
        routerLinkActive="active"
        (click)="persistNavigationAtHistory()"
        #builderRouterLinkActive="routerLinkActive"
      >
        <tri-icon svgIcon="outline:plus" [class.active]="builderRouterLinkActive.isActive"></tri-icon>
      </a>
    </div>

    <div [triTooltip]="'State'" triTooltipPosition="right">
      <a class="state"
         (click)="openStateManager()">
        <tri-icon icon="workbench:workflow-state-management" pack="bakery"></tri-icon>
      </a>
    </div>

    <div [triTooltip]="'Data'" triTooltipPosition="right">
      <a
        class="data"
        title="Data"
        (click)="openWorkflowFrontend()"
      >
        <tri-icon name="workbench:workflow-data"></tri-icon>
        <!--        <div class="beta">beta</div>-->
      </a>
    </div>
    <div [triTooltip]="'Painter'" triTooltipPosition="right">
      <a
        class="painter"
        routerLink="painter"
        title="Painter"
        routerLinkActive="active"
        (click)="persistNavigationAtHistory()"
        #painterRouterLinkActive="routerLinkActive"
      >
        <tri-icon svgIcon="workbench:painter" [class.active]="builderRouterLinkActive.isActive"></tri-icon>
      </a>
    </div>

    <div [triTooltip]="'Schema'" triTooltipPosition="right">
      <a class="schema">
        <tri-icon svgIcon="reiki:schema"></tri-icon>
      </a>
    </div>
    <div [triTooltip]="'Database'" triTooltipPosition="right">
      <a class="database"
         (click)="openDatabaseDialog()"
      >
        <tri-icon svgIcon="reiki:database"></tri-icon>
      </a>
    </div>


  `
})
export class ToolsMenuComponent implements OnInit, OnDestroy {
  @ViewChild(PopoverDirective) popover: PopoverDirective;

  private destroyed$: Subject<void>                  = new Subject<void>();
  private isTutorialInProgress$: Observable<boolean> = this.projectFacade.isTutorialInProgress$;


  constructor(
    private userFacade: UserFacade,
    private userService: UserService,
    private projectFacade: ProjectFacade,
    // private videoTutorialService: VideoTutorialService,
    private historyFacade: HistoryFacadeService,
    private router: Router,
    private stateManagerDialogService: StateManagerDialogService,
    private workflowFrontendDialogService: WorkflowFrontendDialogService,
    private builderSidebarService: BuilderSidebarService,
    private databaseBuilderDialogService: DatabaseBuilderDialogService
  ) {
  }

  openStateManager() {
    this.stateManagerDialogService.open();
  }

  openWorkflowFrontend() {
    this.workflowFrontendDialogService.open();
  }

  openDatabaseDialog() {
    this.databaseBuilderDialogService.open();
  }

  toggleComponents() {

  }

  toggleSettings() {
    this.builderSidebarService.toggle();
  }

  closePopover(): void {
    this.popover.hide();
  }

  persistNavigationAtHistory(): void {
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => this.historyFacade.persistNavigationToCurrentTool());
  }

  openDataTutorial(): void {
    this.persistNavigationAtHistory();

    // if (this.popover.isShown) {
    //   this.popover.hide();
    // }
    //
    // const dataVideoTutorialId = 'Kpo8rGE1jBc';

    // this.userFacade.viewedDataConnectionTutorials$
    //   .pipe(
    //     take(1),
    //     filter((viewedDataConnectionTutorials: boolean) => !viewedDataConnectionTutorials),
    //     onlyLatestFrom(this.isTutorialInProgress$),
    //     filter((progress: boolean) => !progress),
    //     switchMap(() => this.userService.saveViewedDataConnectionTutorials()),
    //     map(() => this.videoTutorialService.open(dataVideoTutorialId)),
    //     takeUntil(this.destroyed$)
    //   )
    //   .subscribe();
  }

  private showDataConnectionNotification(): void {
    // this.userFacade.viewedDataConnectionNotification$
    //   .pipe(
    //     take(1),
    //     filter((viewedDataConnectionNotification: boolean) => !viewedDataConnectionNotification),
    //     onlyLatestFrom(this.isTutorialInProgress$),
    //     filter((progress: boolean) => !progress),
    //     switchMap(() => this.userService.saveViewedDataConnectionNotification()),
    //     map(() => this.popover.show()),
    //     takeUntil(this.destroyed$)
    //   )
    //   .subscribe();
  }

  ngOnInit(): void {
    this.showDataConnectionNotification();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

}
