import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ShadedColor, ThemeColors } from '@common/public-api';
import { combineLatest, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { environment } from '@environments';

@Injectable({ providedIn: 'root' })
export class PainterApiService {
  constructor(private http: HttpClient) {
  }

  generateShades(color: string, count: number): Observable<ShadedColor> {
    const trimmedColor: string = color.substring(1);
    return this.delayResponse(
      this.http.get(`${environment.apiUrl}/painter/shades?color=${trimmedColor}&count=${count}`)
    ).pipe(map((shades: string[]) => this.makeShadedColorFromArray(shades)));
  }

  generateSupport(primary: string): Observable<Partial<ThemeColors>> {
    const trimmedColor: string = primary.substring(1);
    return this.delayResponse(this.http.get(`${environment.apiUrl}/painter/support?primary=${trimmedColor}`)).pipe(
      map((supportColors: { [colorName: string]: string[] }) => {
        return {
          primary: this.makeShadedColorFromArray(supportColors.primary),
          info: this.makeShadedColorFromArray(supportColors.info),
          success: this.makeShadedColorFromArray(supportColors.success),
          warning: this.makeShadedColorFromArray(supportColors.warning),
          danger: this.makeShadedColorFromArray(supportColors.danger)
        };
      })
    );
  }

  private makeShadedColorFromArray(arr: string[]): ShadedColor {
    const shadedColor = {};
    arr.forEach((c: string, i: number) => (shadedColor[`_${i + 1}00`] = c));
    return shadedColor as ShadedColor;
  }

  private delayResponse<T>(obs: Observable<T>, delayTime: number = 1500): Observable<T> {
    return combineLatest([obs, of(null).pipe(delay(delayTime))]).pipe(map(([result]: [T, null]) => result));
  }
}
