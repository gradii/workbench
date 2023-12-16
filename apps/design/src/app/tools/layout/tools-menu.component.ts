import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { onlyLatestFrom } from '@common';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';

import { UserFacade } from '@auth/user-facade.service';
import { UserService } from '@auth/user.service';
import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { VideoTutorialService } from './video-tutorial/video-tutorial.service';
import { HistoryFacadeService } from '@tools-state/history/history-facade.service';

@Component({
  selector: 'ub-tools-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tools-menu.component.scss'],
  template: `
    <a
      class="builder"
      title="Builder"
      routerLink="builder"
      routerLinkActive="active"
      (click)="persistNavigationAtHistory()"
      #builderRouterLinkActive="routerLinkActive"
    >
      <bc-icon name="plus-square" [class.active]="builderRouterLinkActive.isActive"></bc-icon>
    </a>

    <a
      class="data"
      routerLink="data"
      title="Data"
      routerLinkActive="active"
      [nbPopover]="tutorialPopover"
      nbPopoverPlacement="right"
      nbPopoverTrigger="noop"
      (click)="openDataTutorial()"
      #dataRouterLinkActive="routerLinkActive"
    >
      <bc-icon name="workflow-data" [class.active]="builderRouterLinkActive.isActive"></bc-icon>
      <div class="beta">beta</div>
    </a>

    <a
      class="painter"
      routerLink="painter"
      title="Painter"
      routerLinkActive="active"
      (click)="persistNavigationAtHistory()"
      #painterRouterLinkActive="routerLinkActive"
    >
      <bc-icon name="painter" [class.active]="builderRouterLinkActive.isActive"></bc-icon>
    </a>

    <ng-template #tutorialPopover>
      <div class="tutorial-popover">
        <div>New! Data Connection</div>
        <button nbButton size="tiny" status="primary" (click)="closePopover()">Ok</button>
      </div>
    </ng-template>
  `
})
export class ToolsMenuComponent implements OnInit, OnDestroy {
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;

  private destroyed$: Subject<void> = new Subject<void>();
  private isTutorialInProgress$: Observable<boolean> = this.projectFacade.isTutorialInProgress$;

  constructor(
    private userFacade: UserFacade,
    private userService: UserService,
    private projectFacade: ProjectFacade,
    private videoTutorialService: VideoTutorialService,
    private historyFacade: HistoryFacadeService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.showDataConnectionNotification();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
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

    if (this.popover.isShown) {
      this.popover.hide();
    }

    const dataVideoTutorialId = 'Kpo8rGE1jBc';

    this.userFacade.viewedDataConnectionTutorials$
      .pipe(
        take(1),
        filter((viewedDataConnectionTutorials: boolean) => !viewedDataConnectionTutorials),
        onlyLatestFrom(this.isTutorialInProgress$),
        filter((progress: boolean) => !progress),
        switchMap(() => this.userService.saveViewedDataConnectionTutorials()),
        map(() => this.videoTutorialService.open(dataVideoTutorialId)),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  private showDataConnectionNotification(): void {
    this.userFacade.viewedDataConnectionNotification$
      .pipe(
        take(1),
        filter((viewedDataConnectionNotification: boolean) => !viewedDataConnectionNotification),
        onlyLatestFrom(this.isTutorialInProgress$),
        filter((progress: boolean) => !progress),
        switchMap(() => this.userService.saveViewedDataConnectionNotification()),
        map(() => this.popover.show()),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }
}
