import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { PageFacade } from '@tools-state/page/page-facade.service';
import { UIActionIntentService } from '@tools-state/ui-action/ui-action-intent.service';
import { CommunicationService } from '@shared/communication/communication.service';
import { UserFacade } from '@auth/user-facade.service';
import { SettingsFacade } from '@tools-state/settings/settings.facade';
import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { UserService } from '@auth/user.service';
import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { LoaderService } from '@core/loader.service';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { WorkingAreaFacade } from '@tools-state/working-area/working-area-facade.service';
import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { filter, map, mergeMap, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DeployPopupComponent } from './deploy-popup/deploy-popup.component';
import { DeployLogComponent } from './deploy-log/deploy-log.component';
import { TriDialogService } from '@gradii/triangle/dialog';


@Component({
  selector       : 'b-tools',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <div class="d-flex flex-column">
      <tri-alert [type]="'info'" [showIcon]="false" [closeable]="false">
        <ul *triAlertDescription class="d-inline-block">
          <li>选择计划任务配置计划任务并绑定对应action</li>
          <li>任务在后台执行</li>
        </ul>
      </tri-alert>

      <div class="align-self-end mt-2">
        <button triButton class="mx-1" (click)="onDeploy()">部署</button>
      </div>

<!--      <nb-route-tabset [tabs]="tabs"></nb-route-tabset>-->
    </div>
    <!--    <router-outlet></router-outlet>-->
  `,
  styleUrls      : ['./backend-tools.component.scss']
  // animations: [toolsSwitchAnimation(TOOLS)]
})
export class BackendToolsComponent implements OnInit, OnDestroy{
  tabs = [
    {
      title: 'Trigger',
      route: './trigger'
    },
    {
      title: 'Workflow',
      route: './workflow'
    }

  ];
  private window: any;
  private destroyed$ = new Subject<void>();

  deployPopup = DeployPopupComponent;

  constructor(
    private componentFacade: ComponentFacade,
    private workingAreaFacade: WorkingAreaFacade,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    // private themeService: NbThemeService,
    private projectFacade: ProjectFacade,
    private userService: UserService,
    private projectBriefFacade: ProjectBriefFacade,
    private settingsFacade: SettingsFacade,
    private userFacade: UserFacade,
    private communicationService: CommunicationService,
    private actionIntentService: UIActionIntentService,
    private pageFacade: PageFacade,
    private dialogService: TriDialogService,
  ) {
    this.window = window;
  }

  onDeploy() {
    this.dialogService.open(DeployLogComponent);
    // const results = this.dialogService.open({
    //   title  : '部署日志',
    //   width  : '1000px',
    //   content: DeployLogComponent,
    //   data   : {
    //     // info: this.projectBriefFacade.projects$
    //   },
    //   buttons: [
    //     // {
    //     //   cssClass: 'primary',
    //     //   text    : '重新部署',
    //     //   handler : ($event: Event) => {
    //     //     // results.modalInstance.hide();
    //     //   }
    //     // }
    //   ]
    // });
  }

  // onViewLog() {
  //
  // }

  ngOnInit() {
    this.componentFacade.attach();
    this.setWorkingAreaMode();
    this.loaderService.show();
    // this.themeService.changeTheme('dark');
    // this.subscribeWindowWidthChanges();
    this.projectBriefFacade.loadProjects();
    this.settingsFacade.loadSettings();
    // this.setWorkbenchUserNotifications();
    // this.subscribeOnNavigationFeedback();
  }


  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.componentFacade.detach();
    this.actionIntentService.detach();
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
      .subscribe((data: Data) => {
        if (data['mode']) {
          this.workingAreaFacade.changeMode(data['mode']);
        }
        if (data['workflowMode']) {
          this.workingAreaFacade.changeWorkflowMode(data['workflowMode']);
        }
      });
  }

}
