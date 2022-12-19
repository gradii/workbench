import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Template, TemplateBag, TemplateBagResponse } from '@account-state/template/template.model';
import { environment } from '@environments';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private baseUrl = `${environment.apiUrl}/workbench/template`;

  constructor(private http: HttpClient) {
  }

  loadTemplateList(): Observable<Template[]> {
    return this.http
      .get<Template[]>(`${this.baseUrl}/all-enabled`)
      .pipe(map((templateList: Template[]) => this.patchLink(templateList)));
  }

  loadTemplateBag(templateId: string): Observable<TemplateBag> {
    return this.http
      .get<TemplateBagResponse>(`${this.baseUrl}/${templateId}`)
      .pipe(map(response => this.parseBagResponse(response)));
  }

  private parseBagResponse(response: TemplateBagResponse): TemplateBag {
    return {
      ...response,
      app: JSON.parse(response.model)
    };
  }

  private patchLink(templateList: Template[]): Template[] {
    return templateList.map(t => ({ ...t, previewLink: `${environment.appServerName}/share/${t.previewLink}` }));
  }
}
