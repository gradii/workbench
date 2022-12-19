import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { onlyLatestFrom } from '@common/public-api';
import { createEffect, ofType } from '@ngneat/effects';
import { FileStorageService } from '@shared/file-storage.service';
import { ProjectDto, ProjectService } from '@shared/project.service';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { ProjectBriefActions } from '../projects/project-brief.actions';
import { ProjectSettingsActions } from './project-settings.actions';
import { ProjectSettings } from './project-settings.model';
import { getCurrentProject, getCurrentProjectId, getProjectSettings } from './project-settings.selectors';

@Injectable()
export class ProjectSettingsEffects {

  reducer$ = createEffect((actions) => actions.pipe(
    ofType(ProjectSettingsActions.loadProjectSettings)
  ));

  loadProjectSettings$ = createEffect((actions) =>
    actions.pipe(
      ofType(ProjectSettingsActions.loadProjectSettings),
      onlyLatestFrom(getCurrentProjectId),
      mergeMap(projectId =>
        this.projectService.getProject(projectId).pipe(
          map((project: ProjectDto) => ProjectSettingsActions.loadProjectSettingsSuccess(project)),
          catchError(() => of(ProjectSettingsActions.loadProjectSettingsFailed()))
        )
      )
    )
  );

  updateProjectSettings$ = createEffect((actions) =>
    actions.pipe(
      ofType(ProjectSettingsActions.updateProjectSettings),
      withLatestFrom(getCurrentProject),
      mergeMap(([{ settings }, project]: [{ settings: ProjectSettings }, ProjectDto]) => {
        return this.projectService.updateProjectModel(project.viewId, { ...project.app, ...settings }).pipe(
          map((updatedProject: ProjectDto) =>
            ProjectSettingsActions.updateProjectSettingsSuccess(updatedProject )
          ),
          catchError(error => of(ProjectSettingsActions.updateProjectSettingsFailed(error )))
        );
      })
    )
  );

  uploadFavicon$ = createEffect((actions) =>
    actions.pipe(
      ofType(ProjectSettingsActions.uploadFavicon),
      withLatestFrom(getCurrentProjectId),
      mergeMap(([{ favicon }, projectId]) => {
        const formData = new FormData();
        formData.append('file', favicon, favicon.name);
        formData.append('viewId', projectId);

        return this.fileStorageService.uploadFile(formData).pipe(
          map(faviconAsset =>
            ProjectSettingsActions.uploadFaviconSuccess(this.fileStorageService.generateStorageAssetUrl(faviconAsset))
          ),
          catchError(() => of(ProjectSettingsActions.uploadFaviconFailed()))
        );
      })
    )
  );

  uploadFaviconSuccess$ = createEffect((actions) =>
    actions.pipe(
      ofType(ProjectSettingsActions.uploadFaviconSuccess),
      withLatestFrom(getProjectSettings),
      map(([{ faviconUrl }, settings]) =>
        ProjectSettingsActions.updateProjectSettings({ ...settings, favicon: faviconUrl })
      )
    )
  );

  deleteProjectSuccess$ = createEffect(
    (actions) => actions.pipe(
        ofType(ProjectBriefActions.DeleteProjectSuccess),
        tap(() => {
          this.router.navigate(['/projects']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private projectService: ProjectService,
    private fileStorageService: FileStorageService,
    private router: Router
  ) {
  }
}
