import { Inject, Injectable } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable()
export class ProjectNameValidator {
  constructor(
    private projectBriefFacade: ProjectBriefFacade
  ) {

  }

  taken(control: UntypedFormControl): Observable<{ taken: boolean }> {
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
