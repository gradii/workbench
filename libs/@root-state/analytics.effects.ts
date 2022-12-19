import { Injectable } from '@angular/core';
import { AnalyticsService } from '@common/public-api';
import { ofType } from '@ngneat/effects';
import { createEffect } from '@ngneat/effects';

import { LayoutActions } from '@tools-state/layout/layout.actions';
import { BakeryLayout } from '@tools-state/layout/layout.model';
import { getLayout } from '@tools-state/layout/layout.selectors';
import { PageActions } from '@tools-state/page/page.actions';
import { getActivePageLayout } from '@tools-state/page/page.selectors';
import { filter, switchMap, take, tap } from 'rxjs/operators';

@Injectable()
export class AnalyticsEffects {
  layoutChange$ = createEffect((actions) => actions.pipe(
      ofType(LayoutActions.UpdateLayout),
      switchMap(_ => getLayout.pipe(take(1))),
      tap((layout: BakeryLayout) => {
        const { newLayout } = this.createAnalyticsEvent(layout);
        this.analytics.logChangeLayout(newLayout, 'All Pages');
      })
    ),
    { dispatch: false }
  );

  pageLayoutChange$ = createEffect((actions) => actions.pipe(
      ofType(PageActions.UpdatePage),
      switchMap(_ => getActivePageLayout.pipe(take(1))),
      filter(l => !!l),
      tap((layout: BakeryLayout) => {
        const { newLayout } = this.createAnalyticsEvent(layout);
        this.analytics.logChangeLayout(newLayout, 'Current Page');
      })
    ),
    { dispatch: false }
  );

  constructor(private analytics: AnalyticsService) {
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
