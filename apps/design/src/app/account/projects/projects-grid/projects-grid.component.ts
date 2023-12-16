import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { noProjectEnterAnimation, projectEnterLeaveAnimation } from './projects-grid-animation';

@Component({
  selector: 'ub-projects-grid',
  styleUrls: ['./projects-grid.component.scss'],
  templateUrl: './projects-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [projectEnterLeaveAnimation, noProjectEnterAnimation]
})
export class ProjectsGridComponent {
  projects$: Observable<ProjectBrief[]> = this.projectBriefFacade.projects$;
  projectsLoading$: Observable<boolean> = this.projectBriefFacade.projectsLoading$;

  constructor(private projectBriefFacade: ProjectBriefFacade) {
  }

  openProject(id: string) {
    this.projectBriefFacade.openProject(id);
  }
}
