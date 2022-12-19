import { Injectable } from '@angular/core';
import { dispatch } from '@ngneat/effects';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import { ProjectBriefFacade } from '../projects/project-brief-facade.service';

import { ProjectBrief } from './../projects/project-brief.model';
import { ProjectSettingsActions } from './project-settings.actions';
import { ProjectSettings } from './project-settings.model';
import {
  getCurrentProjectId, getFaviconUploadFailed, getFaviconUploading, getProjectSettings, getProjectSettingsFailed,
  getProjectSettingsLoading
} from './project-settings.selectors';

@Injectable({ providedIn: 'root' })
export class ProjectSettingsFacade {
  private readonly currentProjectId$: Observable<string> = getCurrentProjectId;

  readonly currentProject$: Observable<ProjectBrief> = this.projectBriefFacade.projects$.pipe(
    withLatestFrom(this.currentProjectId$),
    map(([projects, currentProjectId]) => projects.find(project => project.viewId === currentProjectId))
  );

  readonly settings$: Observable<ProjectSettings> = getProjectSettings;

  readonly loading$: Observable<boolean> = combineLatest([
    this.projectBriefFacade.projectsLoading$,
    this.projectBriefFacade.updateProjectLoading$,
    getProjectSettingsLoading,
    getFaviconUploading
  ]).pipe(
    map(([projectBriefLoading, projectBriefUpdateLoading, projectSettingsLoading, faviconUploading]) => {
      return projectBriefLoading || projectBriefUpdateLoading || projectSettingsLoading || faviconUploading;
    })
  );

  readonly failed$: Observable<boolean> = combineLatest([
    this.projectBriefFacade.updateProjectFailed$,
    getProjectSettingsFailed,
    getFaviconUploadFailed
  ]).pipe(
    map(([updateProjectFailed, projectSettingsFailed, faviconUploadFailed]) => {
      return updateProjectFailed || projectSettingsFailed || faviconUploadFailed;
    })
  );

  constructor(private projectBriefFacade: ProjectBriefFacade) {
  }

  updateProjectName(name: string) {
    this.currentProject$
      .pipe(
        take(1),
        filter(currentProject => currentProject.name !== name)
      )
      .subscribe(currentProject => {
        this.projectBriefFacade.update({ ...currentProject, name });
      });
  }

  updateFavicon(favicon: File) {
    if (!favicon) {
      return;
    }
    dispatch(ProjectSettingsActions.uploadFavicon(favicon));
  }

  updateCode(code: string) {
    this.settings$
      .pipe(
        take(1),
        filter(settings => settings.code !== code)
      )
      .subscribe(settings => {
        dispatch(ProjectSettingsActions.updateProjectSettings({ ...settings, code }));
      });
  }

  setProjectId(projectId: string) {
    dispatch(ProjectSettingsActions.setProjectId(projectId));
    dispatch(ProjectSettingsActions.loadProjectSettings());
  }

  clearFailed() {
    this.projectBriefFacade.clearUpdateProjectFailed();
    dispatch(ProjectSettingsActions.clearProjectSettingsFailed());
  }
}
