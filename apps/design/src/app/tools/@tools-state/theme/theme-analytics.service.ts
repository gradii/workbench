import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ColorInfo, ShadedColor, Theme, ThemeAnalyticItem } from '@common';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ThemeAnalyticsService {
  constructor(private http: HttpClient) {
  }

  public persistThemeInfo(theme: Theme, existingInfo: { [name: string]: Partial<ColorInfo> }): Observable<any> {
    const themeInfo: ThemeAnalyticItem = {
      colors: this.getColorsInfoFromTheme(theme, existingInfo),
      themeId: theme.id,
      theme: theme.dark ? 'dark' : 'default',
      user: null,
      version: null
    };
    return this.http.post(`${environment.apiUrl}/palette/persist`, {
      palette: JSON.stringify(themeInfo),
      source: 'bakery'
    });
  }

  private getColorsInfoFromTheme(theme: Theme, existingInfo: { [name: string]: Partial<ColorInfo> }): ColorInfo[] {
    const colorInfoList: ColorInfo[] = [];
    for (const colorKey of Object.keys(theme.colors)) {
      colorInfoList.push(this.convertColorToInfo(colorKey, theme.colors[colorKey], existingInfo[colorKey]));
    }
    return colorInfoList;
  }

  private convertColorToInfo(name: string, color: ShadedColor, existingInfo?: Partial<ColorInfo>): ColorInfo {
    const colorInfo: ColorInfo = {
      name,
      color: color['_1000'] ? color._600 : color._500,
      locked: !!color.locked,
      shades: this.getShadesInfo(color)
    };
    if (existingInfo && existingInfo.inputSource) {
      colorInfo.inputSource = existingInfo.inputSource;
    }
    if (existingInfo && existingInfo.logo) {
      colorInfo.logo = existingInfo.logo;
    }
    return colorInfo;
  }

  private getShadesInfo(shaded: ShadedColor): { number: number; color: string }[] {
    const shadesInfo: { number: number; color: string }[] = [];
    for (const colorKey of Object.keys(shaded)) {
      if (typeof shaded[colorKey] === 'string') {
        shadesInfo.push({ number: +colorKey.substring(1), color: shaded[colorKey] as string });
      }
    }
    return shadesInfo;
  }
}
