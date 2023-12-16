import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ProjectBriefFacade } from '@account-state/../../@root-state/projects/project-brief-facade.service';
import { ProjectBrief } from '@account-state/../../@root-state/projects/project-brief.model';

@Injectable()
export class ProjectNameValidator {
  constructor(private projectBriefFacade: ProjectBriefFacade) {
  }

  taken(control: FormControl): Observable<{ taken: boolean }> {
    const name = control.value || '';
    return this.projectBriefFacade.projects$.pipe(
      take(1),
      map((projects: ProjectBrief[]) => {
        const taken = projects.some((project: ProjectBrief) => {
          return project.name.toLowerCase().trim() === name.toLowerCase().trim();
        });

        return taken ? { taken: true } : null;
      })
    );
  }
}
