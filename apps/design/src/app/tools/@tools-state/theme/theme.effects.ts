import { ColorInfo, Theme } from '@common';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ErrorHandler, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, mergeMap, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { onlyLatestFrom } from '@common';

import { ProjectActions } from '@tools-state/project/project.actions';
import { getActiveProjectId } from '@tools-state/project/project.selectors';
import { ThemeApiService } from '@tools-state/theme/theme-api.service';
import { ThemeAnalyticsService } from '@tools-state/theme/theme-analytics.service';
import { ThemeActions } from '@tools-state/theme/theme.actions';
import { fromTheme } from '@tools-state/theme/theme.reducer';
import { getActiveTheme } from '@tools-state/theme/theme.selectors';

@Injectable()
export class ThemeEffects {
  @Effect({ dispatch: false })
  persistAnalytics$ = this.actions$.pipe(
    ofType(ThemeActions.ActionTypes.PersistThemeAnalytics),
    withLatestFrom(this.store.pipe(select(getActiveTheme))),
    mergeMap(([action, theme]: [{ [name: string]: Partial<ColorInfo> }, Theme]) =>
      this.persistAnalyticsService$.persistThemeInfo(theme, action)
    ),
    catchError(err => {
      this.errorHandler.handleError(err);
      return of(null);
    })
  );

  @Effect({ dispatch: false })
  persistTheme$ = this.actions$.pipe(
    ofType(ThemeActions.ActionTypes.UpdateTheme),
    onlyLatestFrom(this.store.pipe(select(getActiveTheme))),
    mergeMap((theme: Theme) => this.themeApi.updateTheme(theme))
  );

  @Effect({ dispatch: false })
  selectTheme$ = this.actions$.pipe(
    ofType(ProjectActions.ActionTypes.SelectTheme),
    withLatestFrom(this.store.pipe(select(getActiveProjectId))),
    mergeMap(([action, projectId]: [ProjectActions.SelectTheme, string]) =>
      this.themeApi.selectTheme(projectId, action.themeId)
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromTheme.State>,
    private themeApi: ThemeApiService,
    private errorHandler: ErrorHandler,
    private persistAnalyticsService$: ThemeAnalyticsService
  ) {
  }
}
