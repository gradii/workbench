import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AclService } from '@common';
import { ProjectProperties } from '@common';

import { ProjectBriefActions } from './project-brief.actions';
import { fromProjectBrief } from './project-brief.reducer';
import { ProjectBrief } from './project-brief.model';
import {
  getCreateProjectLoading,
  getDeleteProjectLoading,
  getProjectBriefs,
  getProjectsLoading,
  getUpdateProjectLoading,
  getUpdateProjectFailed
} from './project-brief.selectors';
import { ProjectBriefService } from './project-brief.service';
import { PrivilegesEvaluatorDataSource } from '@core/acl/privileges-evaluator-data-source';

@Injectable({ providedIn: 'root' })
export class ProjectBriefFacade {
  readonly projects$: Observable<ProjectBrief[]> = this.store.pipe(select(getProjectBriefs));

  readonly projectsLoading$: Observable<boolean> = this.store.pipe(select(getProjectsLoading));

  readonly createProjectLoading$: Observable<boolean> = this.store.pipe(select(getCreateProjectLoading));

  readonly deleteProjectLoading$: Observable<boolean> = this.store.pipe(select(getDeleteProjectLoading));

  readonly updateProjectLoading$: Observable<boolean> = this.store.pipe(select(getUpdateProjectLoading));

  readonly updateProjectFailed$: Observable<boolean> = this.store.pipe(select(getUpdateProjectFailed));

  readonly canCreateProject$: Observable<boolean> = this.acl.canCreateProject();

  constructor(
    private store: Store<fromProjectBrief.State>,
    private acl: AclService,
    private roleEvaluator: PrivilegesEvaluatorDataSource,
    private projectsService: ProjectBriefService
  ) {
    this.projects$.subscribe((projects: ProjectBrief[]) => this.roleEvaluator.projects$.next(projects));
  }

  loadProjects() {
    this.store.dispatch(new ProjectBriefActions.LoadProjects());
  }

  openProject(id: string) {
    this.projectsService.openProject(id);
  }

  createProject(name: string, templateId: string, templateName: string, properties: ProjectProperties) {
    this.store.dispatch(new ProjectBriefActions.CreateProject(name, templateId, templateName, properties));
  }

  duplicate(id: string) {
    this.store.dispatch(new ProjectBriefActions.DuplicateProject(id));
  }

  delete(id: string) {
    this.store.dispatch(new ProjectBriefActions.DeleteProject(id));
  }

  update(project: ProjectBrief) {
    this.store.dispatch(new ProjectBriefActions.UpdateProject(project));
  }

  clearUpdateProjectFailed() {
    this.store.dispatch(new ProjectBriefActions.ClearUpdateProjectFailed());
  }
}
