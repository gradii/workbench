import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NB_WINDOW, NbTooltipDirective } from '@nebular/theme';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { DialogService } from '@shared/dialog/dialog.service';
import { CreateProjectDialogComponent } from './create-project-dialog/create-project-dialog.component';
import { TemporaryProjectService } from '@auth/temporary-project.service';
import { UserFacade } from '@auth/user-facade.service';
import { UserService } from '@auth/user.service';
import { TutorialsReleasedNotificationService } from './tutorials-released-notification/tutorials-released-notification.service';

@Component({
  selector: 'ub-projects-component',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements AfterViewInit {
  private readonly FROM_PRICING_KEY = 'from-pricing';
  private readonly CREATE_NEW_PROJECT_KEY = 'create-new-project';

  disableCreation$: Observable<boolean> = this.projectBriefFacade.canCreateProject$.pipe(
    map((canCreate: boolean) => !canCreate),
    tap(() => this.tooltipDirective && this.tooltipDirective.hide())
  );

  @ViewChild(NbTooltipDirective) tooltipDirective: NbTooltipDirective;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject(NB_WINDOW) private window,
    private dialogService: DialogService,
    private userFacade: UserFacade,
    private userService: UserService,
    private tutorialService: TutorialsReleasedNotificationService,
    private projectBriefFacade: ProjectBriefFacade,
    private temporaryProjectService: TemporaryProjectService
  ) {
    const localStorage = this.window.localStorage;

    if (localStorage) {
      const fromPricing = localStorage.getItem(this.FROM_PRICING_KEY);
      localStorage.removeItem(this.FROM_PRICING_KEY);

      if (fromPricing) {
        this.router.navigate(['/plans']);
      }
    }

    this.temporaryProjectService.showProjectCreationErrorIfNeed();
  }

  openCreateProjectDialog() {
    this.dialogService.open(CreateProjectDialogComponent);
  }

  ngAfterViewInit(): void {
    this.checkCreateNewProjectTriggered();
    this.checkOnboardingNotificationViewed();
  }

  private checkCreateNewProjectTriggered(): void {
    // TODO look like it's possible to open create project modal if the user reached projects number threshold
    const createProject = this.route.snapshot.queryParamMap.get(this.CREATE_NEW_PROJECT_KEY);
    this.disableCreation$
      .pipe(
        take(1),
        filter((disableCreation: boolean) => !disableCreation && !!createProject)
      )
      .subscribe(() => this.openCreateProjectDialog());
  }

  private checkOnboardingNotificationViewed(): void {
    this.userFacade.viewedOnboarding$
      .pipe(
        take(1),
        filter((viewedOnboarding: boolean) => !viewedOnboarding)
      )
      .subscribe(() => {
        this.tutorialService.showTutorialReleasedModal();
        this.userService.saveViewedOnboarding();
      });
  }
}
