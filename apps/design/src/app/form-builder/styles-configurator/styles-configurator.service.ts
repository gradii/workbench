import { Injectable } from '@angular/core';
import { ShadedColor, Theme, ThemeColors } from '@common';
import { ColorChange } from '@tools-state/theme/theme.models';
import { combineLatest, Observable, of } from 'rxjs';
import { Update } from '@ngrx/entity';
import { delay, map, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StylesConfiguratorService {
  constructor(private http: HttpClient) {
  }

  updatePrimary(colorChange: ColorChange, theme: Theme): Observable<Update<Theme>> {
    return combineLatest([this.generateSupport(colorChange.color)]).pipe(
      take(1),
      map(([colors]: [Partial<ThemeColors>]) => ({
        id: theme.id,
        changes: this.getGeneratedColorsChanges(theme, colors, true)
      }))
    );
  }

  private getGeneratedColorsChanges(
    theme: Theme,
    colors: Partial<ThemeColors>,
    updatePrimary: boolean
  ): Partial<Theme> {
    const changes = { colors: { ...theme.colors } };
    for (const colorName in colors) {
      if (!theme.colors[colorName].locked) {
        changes.colors[colorName] = colors[colorName];
      }
    }
    if (!updatePrimary) {
      changes.colors.primary = theme.colors.primary;
    }
    return changes;
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

  private delayResponse<T>(obs: Observable<T>): Observable<T> {
    return combineLatest([obs, of(null)]).pipe(
      map(([result]: [T, null]) => result),
      delay(300)
    );
  }
}
