import { Injectable } from '@angular/core';
import { AclService, ProjectProperties } from '@common/public-api';
import { PrivilegesEvaluatorDataSource } from '@core/acl/privileges-evaluator-data-source';
import { dispatch } from '@ngneat/effects';
import { Observable } from 'rxjs';

import { ProjectBriefActions } from './project-brief.actions';
import { ProjectBrief } from './project-brief.model';
import {
  getCreateProjectLoading, getDeleteProjectLoading, getProjectBriefs, getProjectsLoading, getUpdateProjectFailed,
  getUpdateProjectLoading
} from './project-brief.selectors';
import { ProjectBriefService } from './project-brief.service';

@Injectable({ providedIn: 'root' })
export class ProjectBriefFacade {
  readonly projects$: Observable<ProjectBrief[]> = getProjectBriefs;

  readonly projectsLoading$: Observable<boolean> = getProjectsLoading;

  readonly createProjectLoading$: Observable<boolean> = getCreateProjectLoading;

  readonly deleteProjectLoading$: Observable<boolean> = getDeleteProjectLoading;

  readonly updateProjectLoading$: Observable<boolean> = getUpdateProjectLoading;

  readonly updateProjectFailed$: Observable<boolean> = getUpdateProjectFailed;

  readonly canCreateProject$: Observable<boolean> = this.acl.canCreateProject();

  constructor(
    private acl: AclService,
    private roleEvaluator: PrivilegesEvaluatorDataSource,
    private projectsService: ProjectBriefService
  ) {
    this.projects$.subscribe((projects: ProjectBrief[]) => this.roleEvaluator.projects$.next(projects));
  }

  loadProjects() {
    dispatch(ProjectBriefActions.LoadProjects());
  }

  openProject(id: string, type?: string, project?: any) {
    this.projectsService.openProject(id, type, project);
  }

  createProject(name: string, projectType: string, templateId: string, templateName: string,
                properties: ProjectProperties) {
    dispatch(ProjectBriefActions.CreateProject(name, projectType, templateId, templateName, properties));
  }

  duplicate(id: string) {
    dispatch(ProjectBriefActions.DuplicateProject(id));
  }

  delete(id: string) {
    dispatch(ProjectBriefActions.DeleteProject(id));
  }

  update(project: ProjectBrief) {
    dispatch(ProjectBriefActions.UpdateProject(project));
  }

  clearUpdateProjectFailed() {
    dispatch(ProjectBriefActions.ClearUpdateProjectFailed());
  }
}
