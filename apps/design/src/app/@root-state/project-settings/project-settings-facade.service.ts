import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, withLatestFrom, take, filter } from 'rxjs/operators';

import { ProjectBrief } from './../projects/project-brief.model';
import { ProjectBriefFacade } from '../projects/project-brief-facade.service';
import { ProjectSettings } from './project-settings.model';
import {
  getCurrentProjectId,
  getProjectSettings,
  getProjectSettingsLoading,
  getProjectSettingsFailed,
  getFaviconUploading,
  getFaviconUploadFailed
} from './project-settings.selectors';
import { fromProjectSettings } from './project-settings.reducer';
import { ProjectSettingsActions } from './project-settings.actions';

@Injectable({ providedIn: 'root' })
export class ProjectSettingsFacade {
  private readonly currentProjectId$: Observable<string> = this.store.pipe(select(getCurrentProjectId));

  readonly currentProject$: Observable<ProjectBrief> = this.projectBriefFacade.projects$.pipe(
    withLatestFrom(this.currentProjectId$),
    map(([projects, currentProjectId]) => projects.find(project => project.viewId === currentProjectId))
  );

  readonly settings$: Observable<ProjectSettings> = this.store.pipe(select(getProjectSettings));

  readonly loading$: Observable<boolean> = combineLatest([
    this.projectBriefFacade.projectsLoading$,
    this.projectBriefFacade.updateProjectLoading$,
    this.store.pipe(select(getProjectSettingsLoading)),
    this.store.pipe(select(getFaviconUploading))
  ]).pipe(
    map(([projectBriefLoading, projectBriefUpdateLoading, projectSettingsLoading, faviconUploading]) => {
      return projectBriefLoading || projectBriefUpdateLoading || projectSettingsLoading || faviconUploading;
    })
  );

  readonly failed$: Observable<boolean> = combineLatest([
    this.projectBriefFacade.updateProjectFailed$,
    this.store.pipe(select(getProjectSettingsFailed)),
    this.store.pipe(select(getFaviconUploadFailed))
  ]).pipe(
    map(([updateProjectFailed, projectSettingsFailed, faviconUploadFailed]) => {
      return updateProjectFailed || projectSettingsFailed || faviconUploadFailed;
    })
  );

  constructor(private store: Store<fromProjectSettings.State>, private projectBriefFacade: ProjectBriefFacade) {
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
    this.store.dispatch(ProjectSettingsActions.uploadFavicon({ favicon }));
  }

  updateCode(code: string) {
    this.settings$
      .pipe(
        take(1),
        filter(settings => settings.code !== code)
      )
      .subscribe(settings => {
        this.store.dispatch(ProjectSettingsActions.updateProjectSettings({ settings: { ...settings, code } }));
      });
  }

  setProjectId(projectId: string) {
    this.store.dispatch(ProjectSettingsActions.setProjectId({ projectId }));
    this.store.dispatch(ProjectSettingsActions.loadProjectSettings());
  }

  clearFailed() {
    this.projectBriefFacade.clearUpdateProjectFailed();
    this.store.dispatch(ProjectSettingsActions.clearProjectSettingsFailed());
  }
}
