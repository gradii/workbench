import { Injectable } from '@angular/core';
import { ProjectProperties, Theme } from '@common/public-api';
import { dispatch } from '@ngneat/effects';
import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { ProjectBriefDataService } from '@shared/project-brief-data.service';
import { ProjectDto, ProjectService } from '@shared/project.service';
import { AppActions } from '@tools-state/app/app.actions';
import { ProjectActions } from '@tools-state/project/project.actions';

import {
  getActiveProjectId, getActiveProjectName, getShareLink, getShareLoading, getTutorialId
} from '@tools-state/project/project.selectors';
import { ThemeApiService } from '@tools-state/theme/theme-api.service';
import { ThemeActions } from '@tools-state/theme/theme.actions';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap, switchMap, take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProjectFacade {
  readonly shareLink$: Observable<string>             = getShareLink;
  readonly shareLoading$: Observable<boolean>         = getShareLoading;
  readonly activeProjectName$: Observable<string>     = getActiveProjectName;
  readonly activeProjectId$: Observable<string>       = getActiveProjectId;
  readonly tutorialId$: Observable<string>            = getTutorialId;
  readonly isTutorialInProgress$: Observable<boolean> = this.tutorialId$.pipe(
    map((tutorialId: string) => !!tutorialId)
  );

  constructor(
    private projectService: ProjectService,
    private themeApiService: ThemeApiService,
    // private analytics: AnalyticsService,
    private projectBriefDataService: ProjectBriefDataService
  ) {
  }

  initialize(projectId: string): Observable<ProjectDto> {
    return combineLatest([
      this.projectService.getProject(projectId),
      this.themeApiService.loadThemeList(projectId)
    ]).pipe(
      tap(([project, themeList]: [ProjectDto, Theme[]]) => {
        dispatch(ThemeActions.LoadThemeList(themeList));
        dispatch(ProjectActions.OpenProject(project));
        dispatch(AppActions.InitApplication(project.app));
      }),
      map(([project, _]: [ProjectDto, Theme[]]) => project)
    );
  }

  updateSharing(enable: boolean) {
    dispatch(ProjectActions.UpdateSharingLoading());
    getActiveProjectId
      .pipe(
        take(1),
        mergeMap((projectId: string) => this.projectService.updateSharing(projectId, enable))
      )
      .subscribe(
        (shareId: string) => {
          dispatch(ProjectActions.UpdateSharingSuccess(shareId));
          // this.analytics.logShareProject(enable);
        },
        (error: Error) => {
          dispatch(ProjectActions.UpdateSharingError());
          // this.analytics.logShareProject(enable, error.message);
        }
      );
  }

  createFromTutorial(projectName: string, props: ProjectProperties): Observable<string> {
    return getActiveProjectId.pipe(
      switchMap((viewId: string) => this.projectBriefDataService.duplicate(viewId, projectName, props)),
      map((projectBrief: ProjectBrief) => projectBrief.viewId),
      take(1)
    );
  }
}
