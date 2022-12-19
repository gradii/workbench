import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TriDialogService } from '@gradii/triangle/dialog';
import { SidenavService } from '@gradii/triangle/sidenav';
import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';

import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { CreateProjectDialogComponent, ProjectType } from '../create-project-dialog/create-project-dialog.component';
import { noProjectEnterAnimation, projectEnterLeaveAnimation } from './projects-grid-animation';

@Component({
  selector       : 'len-projects-grid',
  templateUrl    : './projects-grid.component.html',
  styleUrls      : ['./projects-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations     : [projectEnterLeaveAnimation, noProjectEnterAnimation]
})
export class ProjectsGridComponent {
  projects$: Observable<ProjectBrief[]> = this.projectBriefFacade.projects$;
  projectsLoading$: Observable<boolean> = this.projectBriefFacade.projectsLoading$;

  projects: ProjectBrief[] = [];
  projectsLoading          = false;

  constructor(
    private projectBriefFacade: ProjectBriefFacade,
    private dialogService: TriDialogService,
    private httpClient: HttpClient,
    private sidenavService: SidenavService
  ) {
  }

  ngOnInit() {
    this.projectsLoading = true;
    this.httpClient.get('/api/workbench/project')
      .pipe(
        tap((data: ProjectBrief[]) => {
          this.projects = data;
        }),
        finalize(() => this.projectsLoading = false)
      )
      .subscribe();
  }

  onToggleSidebar() {
    this.sidenavService.toggle('[sidenav101]')
  }

  openProject(project: ProjectBrief) {
    this.projectBriefFacade.openProject(project.viewId, project.projectType, project);
  }

  openCreateProjectDialog(type?: 'backend' | 'frontend') {
    this.dialogService.open(CreateProjectDialogComponent, {
      data: { projectType: type === 'backend' ? ProjectType.Backend : ProjectType.Frontend }
    });
  }
}
