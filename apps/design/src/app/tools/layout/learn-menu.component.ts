import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { onlyLatestFrom } from '@common';

import { VideoTutorialService } from './video-tutorial/video-tutorial.service';
import { UserService } from '@auth/user.service';
import { InteractiveTutorialService } from '../tutorial/interactive-tutorial/interactive-tutorial.service';
import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { UserFacade } from '@auth/user-facade.service';
import { SettingsFacade } from '@tools-state/settings/settings.facade';

@Component({
  selector: 'ub-learn-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./learn-menu.component.scss'],
  template: `
    <ng-template #tutorialPopover>
      <div class="tutorial-popover">
        <div>Your tutorials are here</div>
        <button nbButton size="tiny" status="primary" (click)="closePopover()">Ok</button>
      </div>
    </ng-template>
    <div class="divider"></div>
    <button title="X-Ray" nbButton ghost class="bakery-button" [class.active]="xray$ | async" (click)="toggleXRay()">
      <bc-icon name="x-ray"></bc-icon>
    </button>
    <div class="divider"></div>
    <button
      title="Tutorials"
      [class.should-shake]="shouldShake$ | async"
      nbButton
      ghost
      class="bakery-button"
      [nbPopover]="tutorialPopover"
      nbPopoverPlacement="right"
      nbPopoverTrigger="noop"
      (click)="openInteractiveTutorial()"
    >
      <bc-icon name="tutorials-menu"></bc-icon>
    </button>
    <div class="divider"></div>
    <a title="Video Tutorials" nbButton ghost class="bakery-button" (click)="openVideoTutorial()">
      <bc-icon name="video"></bc-icon>
    </a>
    <div class="divider"></div>
    <a title="Academy" href="https://academy.uibakery.io" class="bakery-button" target="_blank" nbButton ghost>
      <bc-icon name="book-open"></bc-icon>
    </a>
  `
})
export class LearnMenuComponent implements OnDestroy {
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;

  private destroyed$: Subject<void> = new Subject<void>();
  private isTutorialInProgress$: Observable<boolean> = this.projectFacade.isTutorialInProgress$;

  xray$: Observable<boolean> = this.settingsFacade.xray$;
  shouldShake$: Observable<boolean> = this.userFacade.viewedTutorialsNotification$.pipe(
    take(1),
    filter((viewedDemo: boolean) => !viewedDemo),
    onlyLatestFrom(this.isTutorialInProgress$),
    filter((progress: boolean) => !progress),
    switchMap(() => this.userService.saveViewedTutorialsNotification()),
    tap(() => this.popover.show()),
    map(() => true),
    takeUntil(this.destroyed$)
  );

  constructor(
    private videoTutorialService: VideoTutorialService,
    private interactiveTutorialService: InteractiveTutorialService,
    private projectFacade: ProjectFacade,
    private userFacade: UserFacade,
    private userService: UserService,
    private settingsFacade: SettingsFacade
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  closePopover(): void {
    this.popover.hide();
  }

  openInteractiveTutorial(): void {
    this.interactiveTutorialService.open();
  }

  openVideoTutorial(): void {
    this.userService.saveViewedDemo();
    this.videoTutorialService.open();
  }

  toggleXRay(): void {
    this.settingsFacade.toggleXRay();
  }
}
