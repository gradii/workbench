import { ProjectBriefService } from '@root-state/projects/project-brief.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AnalyticsService } from '@common';

import { ProjectBriefActions } from './project-brief.actions';
import { ProjectBriefDataService } from '@shared/project-brief-data.service';
import { ProjectBrief } from './project-brief.model';

@Injectable()
export class ProjectBriefEffects {
  @Effect()
  loadAll = this.actions$.pipe(
    ofType(ProjectBriefActions.ActionTypes.LoadProjects),
    mergeMap(() =>
      this.projectBriefData.getAllProjectBriefs().pipe(
        map((projects: ProjectBrief[]) => new ProjectBriefActions.LoadProjectsSuccess(projects)),
        catchError(() => of(new ProjectBriefActions.LoadProjectsFailed()))
      )
    )
  );

  @Effect()
  create = this.actions$.pipe(
    ofType(ProjectBriefActions.ActionTypes.CreateProject),
    mergeMap((action: ProjectBriefActions.CreateProject) =>
      this.projectBriefData.createProject(action.name, action.templateId, action.properties).pipe(
        map((project: ProjectBrief) => {
          this.analytics.logCreateNewProject(action.templateName, action.properties);
          return new ProjectBriefActions.CreateProjectSuccess(project);
        }),
        catchError((error: Error) => {
          this.analytics.logCreateNewProject(action.templateName, action.properties, error.message);
          return of(new ProjectBriefActions.CreateProjectFailed());
        })
      )
    )
  );

  @Effect({ dispatch: false })
  openOnCreate = this.actions$.pipe(
    ofType(ProjectBriefActions.ActionTypes.CreateProjectSuccess),
    tap((action: ProjectBriefActions.CreateProjectSuccess) => this.projectsService.openProject(action.project.viewId))
  );

  @Effect()
  duplicate = this.actions$.pipe(
    ofType(ProjectBriefActions.ActionTypes.DuplicateProject),
    mergeMap((action: ProjectBriefActions.DuplicateProject) =>
      this.projectBriefData.duplicate(action.id).pipe(
        map((project: ProjectBrief) => {
          this.analytics.logDuplicateProject(project);
          return new ProjectBriefActions.DuplicateProjectSuccess(project);
        }),
        catchError((error: Error) => {
          this.analytics.logDuplicateProjectError(error.message);
          return of(new ProjectBriefActions.DuplicateProjectFailed());
        })
      )
    )
  );

  @Effect()
  delete = this.actions$.pipe(
    ofType(ProjectBriefActions.ActionTypes.DeleteProject),
    mergeMap((action: ProjectBriefActions.DeleteProject) =>
      this.projectBriefData.delete(action.id).pipe(
        map(() => new ProjectBriefActions.DeleteProjectSuccess(action.id)),
        catchError(() => of(new ProjectBriefActions.DeleteProjectFailed()))
      )
    )
  );

  @Effect()
  update = this.actions$.pipe(
    ofType(ProjectBriefActions.ActionTypes.UpdateProject),
    mergeMap((action: ProjectBriefActions.UpdateProject) =>
      this.projectBriefData.update(action.project).pipe(
        map(() => new ProjectBriefActions.UpdateProjectSuccess(action.project)),
        catchError(() => of(new ProjectBriefActions.UpdateProjectFailed()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private projectBriefData: ProjectBriefDataService,
    private projectsService: ProjectBriefService,
    private analytics: AnalyticsService
  ) {
  }
}
