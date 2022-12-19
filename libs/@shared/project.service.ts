import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AnalyticsService } from '@common/public-api';

import { PuffApp } from '@tools-state/app/app.model';
import { AppModelVersionService } from '@shared/app-model-version.service';
import { environment } from '@environments';

interface ProjectResponse {
  project: ProjectInResponse;
}

interface ProjectInResponse {
  // id: string;
  viewId: string;
  shareId: string;
  model: any;
  name: string;
  version: number;
  themeId: string;
  tutorialId: string;
  editsCount: number;
  type: string
}

export interface ProjectDto {
  // id: string;
  viewId: string,
  app: PuffApp;
  shareId: string;
  themeId: string;
  name: string;
  tutorialId: string;
  editsCount: number;
  type: string
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(
    private http: HttpClient,
    private analyticsService: AnalyticsService,
    private appModelVersionService: AppModelVersionService
  ) {
  }

  getProject(projectId: string): Observable<ProjectDto> {
    return this.http.get(`${environment.apiUrl}/workbench/project/${projectId}`).pipe(
      tap((response: ProjectResponse) => this.checkVersion(response)),
      map((response: ProjectResponse) => this.parseProjectResponse(response))
    );
  }

  getAllProjects(): Observable<ProjectDto[]> {
    return this.http
      .get(`${environment.apiUrl}/workbench/project/all-with-model`)
      .pipe(map((response: ProjectInResponse[]) => response.map(item => this.parseProjectResponse({ project: item }))));
  }

  updateProjectModel(projectViewId: string, newState: PuffApp): Observable<ProjectDto> {
    return this.http
      .put(`${environment.apiUrl}/workbench/project/${projectViewId}/model`, {
        model: JSON.stringify(newState),
        version: this.appModelVersionService.currentVersion
      })
      .pipe(
        tap((response: ProjectResponse) => this.checkVersion(response)),
        map((response: ProjectResponse) => this.parseProjectResponse(response)),
        tap((project: ProjectDto) => this.analyticsService.logProjectEditUI(project.viewId, project.editsCount))
      );
  }

  updateProjectThumbnail(projectId: string, thumbnail: string): Observable<null> {
    return this.http
      .put(`${environment.apiUrl}/workbench/project/${projectId}/thumbnail`, { thumbnail })
      .pipe<any>(catchError(() => of(null)));
  }

  updateSharing(projectId: string, enable: boolean): Observable<string> {
    return this.http
      .put(`${environment.apiUrl}/workbench/project/${projectId}/share`, { enable })
      .pipe(map(({ shareId }: { shareId: string }) => shareId));
  }

  private parseProjectResponse(response: ProjectResponse): ProjectDto {
    const { /*id, */viewId, model, name, themeId, shareId, tutorialId, editsCount, type } = response.project;

    return {
      // id,
      viewId,
      app: model,
      name,
      themeId,
      shareId,
      tutorialId,
      editsCount,
      type
    };
  }

  private checkVersion(response: ProjectResponse) {
    this.appModelVersionService.verify(response.project.version);
  }
}
