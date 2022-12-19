import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { AppActions } from '@tools-state/app/app.actions';
import { dispatch } from '@ngneat/effects';

@Injectable()
export class ProjectPreloadResolver implements Resolve<boolean> {
  constructor(private router: Router, private projectFacade: ProjectFacade) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id: string = route.paramMap.get('projectId');
    dispatch(AppActions.ClearAppState());
    return this.projectFacade.initialize(id).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
