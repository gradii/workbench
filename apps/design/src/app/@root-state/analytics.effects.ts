import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AnalyticsService } from '@common';

import { LayoutActions } from '@tools-state/layout/layout.actions';
import { fromRoot } from '@root-state/root.reducer';
import { getLayout } from '@tools-state/layout/layout.selectors';
import { BakeryLayout } from '@tools-state/layout/layout.model';
import { PageActions } from '@tools-state/page/page.actions';
import { getActivePageLayout } from '@tools-state/page/page.selectors';

@Injectable()
export class AnalyticsEffects {
  layoutChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LayoutActions.ActionTypes.UpdateLayout),
        switchMap(_ => this.store.pipe(select(getLayout), take(1))),
        tap((layout: BakeryLayout) => {
          const { newLayout } = this.createAnalyticsEvent(layout);
          this.analytics.logChangeLayout(newLayout, 'All Pages');
        })
      ),
    { dispatch: false }
  );

  pageLayoutChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PageActions.ActionTypes.UpdatePage),
        switchMap(_ => this.store.pipe(select(getActivePageLayout), take(1))),
        filter(l => !!l),
        tap((layout: BakeryLayout) => {
          const { newLayout } = this.createAnalyticsEvent(layout);
          this.analytics.logChangeLayout(newLayout, 'Current Page');
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private analytics: AnalyticsService, private store: Store<fromRoot.State>) {
  }

  private createAnalyticsEvent(layout: BakeryLayout) {
    const { header, sidebar } = layout.properties;
    let newLayout;

    if (header && sidebar) {
      newLayout = 'Sidebar and Header';
    } else if (sidebar) {
      newLayout = 'Sidebar';
    } else if (header) {
      newLayout = 'Header';
    } else if (!header && !sidebar) {
      newLayout = 'Empty';
    }

    return { newLayout };
  }
}
