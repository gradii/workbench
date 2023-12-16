import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, tap, catchError, mergeMap, withLatestFrom } from 'rxjs/operators';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';

import { onlyLatestFrom } from '@common';
import { ProjectService, ProjectDto } from '@shared/project.service';
import { FileStorageService } from '@shared/file-storage.service';
import { ProjectSettingsActions } from './project-settings.actions';
import { ProjectSettings } from './project-settings.model';
import { fromProjectSettings } from './project-settings.reducer';
import { getCurrentProjectId, getCurrentProject, getProjectSettings } from './project-settings.selectors';
import { ProjectBriefActions } from '../projects/project-brief.actions';

@Injectable()
export class ProjectSettingsEffects {
  loadProjectSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectSettingsActions.loadProjectSettings),
      onlyLatestFrom(this.store.pipe(select(getCurrentProjectId))),
      mergeMap(projectId =>
        this.projectService.getProject(projectId).pipe(
          map((project: ProjectDto) => ProjectSettingsActions.loadProjectSettingsSuccess({ project })),
          catchError(() => of(ProjectSettingsActions.loadProjectSettingsFailed()))
        )
      )
    )
  );

  updateProjectSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectSettingsActions.updateProjectSettings),
      withLatestFrom(this.store.pipe(select(getCurrentProject))),
      mergeMap(([{ settings }, project]: [{ settings: ProjectSettings }, ProjectDto]) => {
        return this.projectService.updateProjectModel(project.id, { ...project.app, ...settings }).pipe(
          map((updatedProject: ProjectDto) =>
            ProjectSettingsActions.updateProjectSettingsSuccess({ project: updatedProject })
          ),
          catchError(error => of(ProjectSettingsActions.updateProjectSettingsFailed({ error })))
        );
      })
    )
  );

  uploadFavicon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectSettingsActions.uploadFavicon),
      withLatestFrom(this.store.pipe(select(getCurrentProjectId))),
      mergeMap(([{ favicon }, projectId]) => {
        const formData = new FormData();
        formData.append('file', favicon, favicon.name);
        formData.append('viewId', projectId);

        return this.fileStorageService.uploadFile(formData).pipe(
          map(faviconAsset =>
            ProjectSettingsActions.uploadFaviconSuccess({
              faviconUrl: this.fileStorageService.generateStorageAssetUrl(faviconAsset)
            })
          ),
          catchError(() => of(ProjectSettingsActions.uploadFaviconFailed()))
        );
      })
    )
  );

  uploadFaviconSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectSettingsActions.uploadFaviconSuccess),
      withLatestFrom(this.store.pipe(select(getProjectSettings))),
      map(([{ faviconUrl }, settings]) =>
        ProjectSettingsActions.updateProjectSettings({ settings: { ...settings, favicon: faviconUrl } })
      )
    )
  );

  deleteProjectSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProjectBriefActions.ActionTypes.DeleteProjectSuccess),
        tap(() => {
          this.router.navigate(['/projects']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromProjectSettings.State>,
    private projectService: ProjectService,
    private fileStorageService: FileStorageService,
    private router: Router
  ) {
  }
}
