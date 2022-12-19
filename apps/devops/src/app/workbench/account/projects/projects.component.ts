import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemporaryProjectService } from '@auth/temporary-project.service';
import { UserFacade } from '@auth/user-facade.service';
import { UserService } from '@auth/user.service';
import { TriDialogService } from '@gradii/triangle/dialog';

import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { CreateProjectDialogComponent, ProjectType } from './create-project-dialog/create-project-dialog.component';

// import { TutorialsReleasedNotificationService } from './tutorials-released-notification/tutorials-released-notification.service';

@Component({
  selector       : 'len-projects-component',
  templateUrl    : './projects.component.html',
  styleUrls      : ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private dialogService: TriDialogService,
    private userFacade: UserFacade,
    private userService: UserService,
    // private tutorialService: TutorialsReleasedNotificationService,
    private projectBriefFacade: ProjectBriefFacade,
    private temporaryProjectService: TemporaryProjectService
  ) {
  }




  // private checkOnboardingNotificationViewed(): void {
  //   this.userFacade.viewedOnboarding$
  //     .pipe(
  //       take(1),
  //       filter((viewedOnboarding: boolean) => !viewedOnboarding)
  //     )
  //     .subscribe(() => {
  //       // this.tutorialService.showTutorialReleasedModal();
  //       // this.userService.saveViewedOnboarding();
  //     });
  // }
}
