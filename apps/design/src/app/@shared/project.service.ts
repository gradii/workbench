import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AnalyticsService } from '@common';

import { BakeryApp } from '@tools-state/app/app.model';
import { AppModelVersionService } from '@shared/app-model-version.service';
import { environment } from '../../environments/environment';

interface ProjectResponse {
  project: ProjectInResponse;
}

interface ProjectInResponse {
  id: string;
  shareId: string;
  model: string;
  name: string;
  version: number;
  themeId: string;
  tutorialId: string;
  editsCount: number;
}

export interface ProjectDto {
  id: string;
  app: BakeryApp;
  shareId: string;
  themeId: string;
  name: string;
  tutorialId: string;
  editsCount: number;
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
    return this.http.get(`${environment.apiUrl}/project/${projectId}`).pipe(
      tap((response: ProjectResponse) => this.checkVersion(response)),
      map((response: ProjectResponse) => this.parseProjectResponse(response))
    );
  }

  getAllProjects(): Observable<ProjectDto[]> {
    return this.http
      .get(`${environment.apiUrl}/project/all-with-model`)
      .pipe(map((response: ProjectInResponse[]) => response.map(item => this.parseProjectResponse({ project: item }))));
  }

  updateProjectModel(projectId: string, newState: BakeryApp): Observable<ProjectDto> {
    return this.http
      .put(`${environment.apiUrl}/project/${projectId}/model`, {
        model: JSON.stringify(newState),
        version: this.appModelVersionService.currentVersion
      })
      .pipe(
        tap((response: ProjectResponse) => this.checkVersion(response)),
        map((response: ProjectResponse) => this.parseProjectResponse(response)),
        tap((project: ProjectDto) => this.analyticsService.logProjectEditUI(project.id, project.editsCount))
      );
  }

  updateProjectThumbnail(projectId: string, thumbnail: string): Observable<null> {
    return this.http
      .put(`${environment.apiUrl}/project/${projectId}/thumbnail`, { thumbnail })
      .pipe(catchError(() => of(null)));
  }

  updateSharing(projectId: string, enable: boolean): Observable<string> {
    return this.http
      .put(`${environment.apiUrl}/project/${projectId}/share`, { enable })
      .pipe(map(({ shareId }: { shareId: string }) => shareId));
  }

  private parseProjectResponse(response: ProjectResponse): ProjectDto {
    const { id, model, name, themeId, shareId, tutorialId, editsCount } = response.project;

    return {
      id,
      app: JSON.parse(model),
      name,
      themeId,
      shareId,
      tutorialId,
      editsCount
    };
  }

  private checkVersion(response: ProjectResponse) {
    this.appModelVersionService.verify(response.project.version);
  }
}
