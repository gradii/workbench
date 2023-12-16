import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectProperties } from '@common';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ProjectBrief } from '@root-state/projects/project-brief.model';

@Injectable({ providedIn: 'root' })
export class ProjectBriefDataService {
  constructor(private http: HttpClient) {
  }

  getAllProjectBriefs(): Observable<ProjectBrief[]> {
    return this.http.get<ProjectBrief[]>(`${environment.apiUrl}/project`);
  }

  createProject(name: string, templateId: string, properties: ProjectProperties): Observable<ProjectBrief> {
    return this.http.post<ProjectBrief>(`${environment.apiUrl}/project`, { name, templateId, properties });
  }

  duplicate(viewId: string, projectName?: string, properties?: ProjectProperties): Observable<ProjectBrief> {
    return this.http.post<ProjectBrief>(`${environment.apiUrl}/project/duplicate`, { viewId, projectName, properties });
  }

  delete(viewId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/project/${viewId}`);
  }

  update(project: ProjectBrief): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/project/${project.viewId}`, { name: project.name });
  }
}
