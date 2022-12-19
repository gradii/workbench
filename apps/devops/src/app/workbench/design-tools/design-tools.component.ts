import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { combineLatest, fromEvent, Observable, Subject } from 'rxjs';
import { filter, map, mergeMap, startWith, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import { WorkingAreaFacade } from '@tools-state/working-area/working-area-facade.service';
import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { LoaderService } from '@core/loader.service';
import { toolsSwitchAnimation } from './tools-switch-animation';

// import 'style-loader!./styles/styles.scss';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { ProjectFacade } from '@tools-state/project/project-facade.service';
// import { TutorialFacade } from '@tools-state/tutorial/tutorial.facade';
import { UserService } from '@auth/user.service';
// import { StartYourJourneyService } from './tutorial/start-your-journey/start-your-journey.service';
import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { SettingsFacade } from '@tools-state/settings/settings.facade';
import { UserFacade } from '@auth/user-facade.service';
import { CommunicationService } from '@shared/communication/communication.service';
import { UIActionIntentService } from '@tools-state/ui-action/ui-action-intent.service';
import { PageFacade } from '@tools-state/page/page-facade.service';
import { LocalStorageFacadeService } from '@workflow-common/util/local-storage-facade.service';

const TOOLS = ['builder', 'painter', 'preview', 'data'];
const OPEN_ON_LARGE_SCREE_THRESHOLD = 700;

@Component({
  selector: 'len-tools',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="projectLoaded">
      <len-layout [@toolsSwitchAnimation]="prepareRoute(outlet)">
        <len-working-area style="display:none"></len-working-area>
        <router-outlet #outlet="outlet"></router-outlet>
      </len-layout>

      <section *ngIf="narrowScreen$ | async" class="narrow-screen-overlay">
        <img src="assets/logo-light.svg" />
        <h1>Please, use a wider screen</h1>
        <h3>Builder is not available on small screens.</h3>
      </section>
    </ng-container>

<!--    <len-not-found *ngIf="!projectLoaded"></len-not-found>-->
    <div *ngIf="!projectLoaded">
      project not found
    </div>
  `,
  styleUrls: ['./design-tools.component.scss'],
  animations: [toolsSwitchAnimation(TOOLS)]
})
export class DesignToolsComponent implements OnInit, AfterViewInit, OnDestroy {
  projectLoaded = this.route.snapshot.data.projectLoaded;
  narrowScreen$: Observable<boolean>;
  private destroyed$ = new Subject<void>();
  private window: Window;

  constructor(
    private componentFacade: ComponentFacade,
    private workingAreaFacade: WorkingAreaFacade,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    // private themeService: NbThemeService,
    private projectFacade: ProjectFacade,
    // private tutorialFacade: TutorialFacade,
    private userService: UserService,
    private projectBriefFacade: ProjectBriefFacade,
    // private startYourJourneyService: StartYourJourneyService,
    private settingsFacade: SettingsFacade,
    // private chatService: ChatService,
    private userFacade: UserFacade,
    private communicationService: CommunicationService,
    private actionIntentService: UIActionIntentService,
    private pageFacade: PageFacade,
    private localStorageFacadeService: LocalStorageFacadeService,
  ) {
    this.window = window;
    // this.chatService.hide();
  }

  ngOnInit() {
    this.componentFacade.attach();
    this.setWorkingAreaMode();
    this.loaderService.show();
    // this.themeService.changeTheme('devops');
    this.subscribeWindowWidthChanges();
    this.projectBriefFacade.loadProjects();
    this.settingsFacade.loadSettings();
    this.setWorkbenchUserNotifications();
    this.subscribeOnNavigationFeedback();
    this.localStorageFacadeService.attach();
  }

  ngAfterViewInit(): void {
    // this.checkIsTutorial();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.componentFacade.detach();
    this.actionIntentService.detach();
    // this.forceCompleteActiveTutorial();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  private setWorkingAreaMode() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route),
        startWith(this.route),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data),
        takeUntil(this.destroyed$)
      )
      .subscribe((data: Data) => this.workingAreaFacade.changeMode(data['mode']));
  }

  private subscribeWindowWidthChanges() {
    this.narrowScreen$ = combineLatest([
      fromEvent(this.window, 'resize').pipe(startWith(this.window.innerWidth)),
      this.workingAreaFacade.workingAreaMode$
    ]).pipe(
      map(([event, mode]: [Event, WorkingAreaMode]) => {
        return this.window.innerWidth < OPEN_ON_LARGE_SCREE_THRESHOLD && mode !== WorkingAreaMode.PREVIEW;
      }),
      tap((narrow: boolean) => {
        if (narrow) {
          this.loaderService.hide();
        }
      })
    );
  }

  // private checkIsTutorial(): void {
  //   this.projectFacade.tutorialId$
  //     .pipe(
  //       take(1),
  //       filter((tutorialProgressId: string) => !!tutorialProgressId)
  //     )
  //     .subscribe((tutorialProgressId: string) => {
  //       const startYourJourney = this.route.snapshot.queryParamMap.get('start-your-journey');
  //
  //       if (startYourJourney) {
  //         this.startYourJourneyService.showStartYourJourneyModal(tutorialProgressId);
  //         this.userService.saveViewedOnboarding();
  //       } else {
  //         this.tutorialFacade.start(tutorialProgressId);
  //       }
  //     });
  // }

  private setWorkbenchUserNotifications(): void {
    const SHOW_RESIZE_ALT_STICK_NOTIFICATION_COUNT = 3;

    this.userFacade.viewedResizeAltStick$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((viewedResizeAltStickCount: number) => {
        const viewedResizeAltStick = viewedResizeAltStickCount >= SHOW_RESIZE_ALT_STICK_NOTIFICATION_COUNT;
        this.communicationService.setUserNotifications({ viewedResizeAltStick });
      });

    this.communicationService.incViewedResizeAltStick$
      .pipe(
        withLatestFrom(this.userFacade.viewedResizeAltStick$),
        map(([_, viewedResizeAltStick]) => viewedResizeAltStick),
        filter(
          (viewedResizeAltStick: number) => (viewedResizeAltStick || 0) < SHOW_RESIZE_ALT_STICK_NOTIFICATION_COUNT
        ),
        switchMap(() => this.userService.incViewedResizeAltStick()),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  private subscribeOnNavigationFeedback(): void {
    this.communicationService.pageSelected$
      .pipe(
        switchMap(({ id }) => this.pageFacade.setActivePage(id, true)),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  /**
   * In case of going to the tutorials from the /auth/welcome screen and then going back to the welcome screen
   * tutorial components aren't destroyed since they're implemented as global services and can't be cleaned through
   * onDestroy hooks.
   *
   * And that's why when the user performs back navigation from the tutorial some components continue to leave with
   * subscriptions to data. But before going to the tutorials screen we're cleaning all the data and those old components
   * are getting errors.
   * */
  // private forceCompleteActiveTutorial(): void {
  //   this.projectFacade.tutorialId$
  //     .pipe(
  //       take(1),
  //       filter((tutorialProgressId: string) => !!tutorialProgressId)
  //     )
  //     .subscribe(() => this.tutorialFacade.finish());
  // }
}
