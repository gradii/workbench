import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Theme } from '@common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

interface ThemeResponse {
  name: string;
  id: string;
  model: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class ThemeApiService {
  constructor(private http: HttpClient) {
  }

  loadThemeList(projectId: string): Observable<Theme[]> {
    return this.http
      .get(`${environment.apiUrl}/theme`, { params: { projectId } })
      .pipe(
        map((themeResponseList: ThemeResponse[]) =>
          themeResponseList.map((response: ThemeResponse) => this.parseThemeResponse(response))
        )
      );
  }

  createTheme(projectId: string, themeInfo: { name: string; dark: boolean }): Observable<Theme> {
    return this.http
      .post(`${environment.apiUrl}/theme/`, themeInfo, { params: { projectId } })
      .pipe(map(({ theme: themeResponse }: { theme: ThemeResponse }) => this.parseThemeResponse(themeResponse)));
  }

  selectTheme(projectId: string, themeId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/theme/select`, {}, { params: { projectId, themeId } });
  }

  renameTheme(id: string, name: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/theme/${id}/rename`, { name });
  }

  updateTheme(theme: Theme): Observable<Theme> {
    return this.http
      .put(`${environment.apiUrl}/theme/${theme.id}/model`, {
        model: JSON.stringify({
          dark: theme.dark,
          colors: theme.colors,
          radius: theme.radius,
          shadow: theme.shadow,
          font: theme.font
        })
      })
      .pipe(map(({ theme: themeResponse }: { theme: ThemeResponse }) => this.parseThemeResponse(themeResponse)));
  }

  deleteTheme(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/theme/${id}`);
  }

  parseThemeResponse(themeResponse: ThemeResponse): Theme {
    const parsedModel = JSON.parse(themeResponse.model);
    return {
      id: themeResponse.id,
      name: themeResponse.name,
      createdAt: themeResponse.createdAt,
      dark: parsedModel.dark,
      radius: parsedModel.radius,
      colors: parsedModel.colors,
      shadow: parsedModel.shadow,
      font: parsedModel.font
    };
  }
}
