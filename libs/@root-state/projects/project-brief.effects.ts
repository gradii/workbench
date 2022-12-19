import { Injectable } from '@angular/core';
import { AnalyticsService } from '@common/public-api';
import { createEffect, ofType } from '@ngneat/effects';
import { ProjectBriefService } from '@root-state/projects/project-brief.service';
import { ProjectBriefDataService } from '@shared/project-brief-data.service';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ProjectBriefActions } from './project-brief.actions';
import { ProjectBrief } from './project-brief.model';

@Injectable()
export class ProjectBriefEffects {
  loadAll = createEffect(actions => actions.pipe(
    ofType(ProjectBriefActions.LoadProjects),
    mergeMap(() =>
      this.projectBriefData.getAllProjectBriefs().pipe(
        map((projects: ProjectBrief[]) => ProjectBriefActions.LoadProjectsSuccess(projects)),
        catchError(() => of(ProjectBriefActions.LoadProjectsFailed()))
      )
    )
  ));

  // @Effect()
  create = createEffect(actions => actions.pipe(
    ofType(ProjectBriefActions.CreateProject),
    mergeMap((action/*: ProjectBriefActions.CreateProject*/) =>
      this.projectBriefData.createProject(action.name, action.projectType, action.templateId, action.properties).pipe(
        map((project: ProjectBrief) => {
          this.analytics.logCreateNewProject(action.templateName, action.projectType, action.properties);
          return ProjectBriefActions.CreateProjectSuccess(project);
        }),
        catchError((error: Error) => {
          this.analytics.logCreateNewProject(action.templateName, action.projectType, action.properties, error.message);
          return of(ProjectBriefActions.CreateProjectFailed());
        })
      )
    )
  ));

  openOnCreate = createEffect(actions => actions.pipe(
    ofType(ProjectBriefActions.CreateProjectSuccess),
    tap(
      (action/*: ProjectBriefActions.CreateProjectSuccess*/) => this.projectsService.openProject(action.project.viewId,
        action.project.projectType))
  ), { dispatch: false });

  duplicate = createEffect(actions => actions.pipe(
    ofType(ProjectBriefActions.DuplicateProject),
    mergeMap((action/*: ProjectBriefActions.DuplicateProject*/) =>
      this.projectBriefData.duplicate(action.id).pipe(
        map((project: ProjectBrief) => {
          this.analytics.logDuplicateProject(project);
          return ProjectBriefActions.DuplicateProjectSuccess(project);
        }),
        catchError((error: Error) => {
          this.analytics.logDuplicateProjectError(error.message);
          return of(ProjectBriefActions.DuplicateProjectFailed());
        })
      )
    )
  ));

  delete = createEffect(actions => actions.pipe(
    ofType(ProjectBriefActions.DeleteProject),
    mergeMap((action/*: ProjectBriefActions.DeleteProject*/) =>
      this.projectBriefData.delete(action.id).pipe(
        map(() => ProjectBriefActions.DeleteProjectSuccess(action.id)),
        catchError(() => of(ProjectBriefActions.DeleteProjectFailed()))
      )
    )
  ));

  // @Effect()
  update = createEffect(actions => actions.pipe(
    ofType(ProjectBriefActions.UpdateProject),
    mergeMap((action/*: ProjectBriefActions.UpdateProject*/) =>
      this.projectBriefData.update(action.project).pipe(
        map(() => ProjectBriefActions.UpdateProjectSuccess(action.project)),
        catchError(() => of(ProjectBriefActions.UpdateProjectFailed()))
      )
    )
  ));

  constructor(
    private projectBriefData: ProjectBriefDataService,
    private projectsService: ProjectBriefService,
    private analytics: AnalyticsService
  ) {
  }
}
