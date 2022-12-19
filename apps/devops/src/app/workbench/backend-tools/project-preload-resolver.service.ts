import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { dispatch } from '@ngneat/effects';
import { AppActions } from '@tools-state/app/app.actions';

import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ProjectPreloadResolver implements Resolve<boolean> {
  constructor(private router: Router,
              private projectFacade: ProjectFacade) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id: string = route.paramMap.get('projectId');
    dispatch(AppActions.ClearAppState());
    return this.projectFacade.initialize(id).pipe(
      map(() => true),
      catchError((err) => {
        console.error(err);
        return of(false);
      })
    );
  }
}
