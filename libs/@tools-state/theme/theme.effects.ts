import { ErrorHandler, Injectable } from '@angular/core';
import { ColorInfo, onlyLatestFrom, Theme } from '@common/public-api';
import { createEffect, ofType } from '@ngneat/effects';

import { ProjectActions } from '@tools-state/project/project.actions';
import { getActiveProjectId } from '@tools-state/project/project.selectors';
import { ThemeAnalyticsService } from '@tools-state/theme/theme-analytics.service';
import { ThemeApiService } from '@tools-state/theme/theme-api.service';
import { ThemeActions } from '@tools-state/theme/theme.actions';
import { getActiveTheme } from '@tools-state/theme/theme.selectors';
import { of } from 'rxjs';
import { catchError, mergeMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class ThemeEffects {
  // @Effect({ dispatch: false })
  persistAnalytics$ = createEffect(actions => actions.pipe(
    ofType(ThemeActions.PersistThemeAnalytics),
    withLatestFrom(getActiveTheme),
    mergeMap(([action, theme]: [{ [name: string]: Partial<ColorInfo> }, Theme]) =>
      this.persistAnalyticsService$.persistThemeInfo(theme, action)
    ),
    catchError(err => {
      this.errorHandler.handleError(err);
      return of(null);
    })
  ));

  // @Effect({ dispatch: false })
  persistTheme$ = createEffect(actions => actions.pipe(
    ofType(ThemeActions.UpdateTheme),
    onlyLatestFrom(getActiveTheme),
    mergeMap((theme: Theme) => this.themeApi.updateTheme(theme))
  ));

  // @Effect({ dispatch: false })
  selectTheme$ = createEffect(actions => actions.pipe(
    ofType(ProjectActions.SelectTheme),
    withLatestFrom(getActiveProjectId),
    mergeMap(([action, projectId]) =>
      this.themeApi.selectTheme(projectId, action.themeId)
    )
  ));

  constructor(
    private themeApi: ThemeApiService,
    private errorHandler: ErrorHandler,
    private persistAnalyticsService$: ThemeAnalyticsService
  ) {
  }
}
