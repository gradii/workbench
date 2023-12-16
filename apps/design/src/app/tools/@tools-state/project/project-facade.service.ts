import { Injectable } from '@angular/core';
import { AnalyticsService, ProjectProperties, Theme } from '@common';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap, switchMap, take, tap } from 'rxjs/operators';

import {
  getActiveProjectId,
  getActiveProjectName,
  getShareLink,
  getShareLoading,
  getTutorialId
} from '@tools-state/project/project.selectors';
import { ThemeActions } from '@tools-state/theme/theme.actions';
import { ThemeApiService } from '@tools-state/theme/theme-api.service';
import { AppActions } from '@tools-state/app/app.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { ProjectDto, ProjectService } from '@shared/project.service';
import { fromTools } from '@tools-state/tools.reducer';
import { ProjectBriefDataService } from '@shared/project-brief-data.service';
import { ProjectBrief } from '@root-state/projects/project-brief.model';

@Injectable({ providedIn: 'root' })
export class ProjectFacade {
  readonly shareLink$: Observable<string> = this.store.pipe(select(getShareLink));
  readonly shareLoading$: Observable<boolean> = this.store.pipe(select(getShareLoading));
  readonly activeProjectName$: Observable<string> = this.store.pipe(select(getActiveProjectName));
  readonly activeProjectId$: Observable<string> = this.store.pipe(select(getActiveProjectId));
  readonly tutorialId$: Observable<string> = this.store.pipe(select(getTutorialId));
  readonly isTutorialInProgress$: Observable<boolean> = this.tutorialId$.pipe(
    map((tutorialId: string) => !!tutorialId)
  );

  constructor(
    private store: Store<fromTools.State>,
    private projectService: ProjectService,
    private themeApiService: ThemeApiService,
    private analytics: AnalyticsService,
    private projectBriefDataService: ProjectBriefDataService
  ) {
  }

  initialize(projectId: string): Observable<ProjectDto> {
    return combineLatest([
      this.projectService.getProject(projectId),
      this.themeApiService.loadThemeList(projectId)
    ]).pipe(
      tap(([project, themeList]: [ProjectDto, Theme[]]) => {
        this.store.dispatch(ThemeActions.loadThemeList({ themeList }));
        this.store.dispatch(new ProjectActions.OpenProject(project));
        this.store.dispatch(new AppActions.InitApplication(project.app));
      }),
      map(([project, _]: [ProjectDto, Theme[]]) => project)
    );
  }

  updateSharing(enable: boolean) {
    this.store.dispatch(new ProjectActions.UpdateSharingLoading());
    this.store
      .pipe(select(getActiveProjectId))
      .pipe(
        take(1),
        mergeMap((projectId: string) => this.projectService.updateSharing(projectId, enable))
      )
      .subscribe(
        (shareId: string) => {
          this.store.dispatch(new ProjectActions.UpdateSharingSuccess(shareId));
          this.analytics.logShareProject(enable);
        },
        (error: Error) => {
          this.store.dispatch(new ProjectActions.UpdateSharingError());
          this.analytics.logShareProject(enable, error.message);
        }
      );
  }

  createFromTutorial(projectName: string, props: ProjectProperties): Observable<string> {
    return this.store.pipe(
      select(getActiveProjectId),
      switchMap((viewId: string) => this.projectBriefDataService.duplicate(viewId, projectName, props)),
      map((projectBrief: ProjectBrief) => projectBrief.viewId),
      take(1)
    );
  }
}
