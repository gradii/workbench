import { Injectable } from '@angular/core';
import { combineWith } from '@common/public-api';
import { dispatch } from '@ngneat/effects';
import { ComponentActions } from '@tools-state/component/component.actions';

import { PuffComponent } from '@tools-state/component/component.model';
import { HistoryActions } from '@tools-state/history/history.actions';
import { LayoutActions } from '@tools-state/layout/layout.actions';
import { BakeryLayout } from '@tools-state/layout/layout.model';
import { getLayout } from '@tools-state/layout/layout.selectors';
import { PageActions } from '@tools-state/page/page.actions';
import { Page } from '@tools-state/page/page.model';
import { getActivePage, getRootSpaceForPage } from '@tools-state/page/page.selectors';
import { ProjectActions } from '@tools-state/project/project.actions';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LayoutFacade {
  readonly layout$: Observable<BakeryLayout> = getLayout.pipe(
    filter(layout => !!layout)
  );

  constructor() {
  }

  updateLayout(change: Partial<BakeryLayout>) {
    getLayout
      .pipe(
        take(1),
        map((layout: BakeryLayout) => this.mergeLayoutWithChanges(change, layout))
      )
      .subscribe((layout: BakeryLayout) => {
        dispatch(LayoutActions.UpdateLayout(layout));
        dispatch(WorkingAreaActions.SyncState());
        dispatch(ProjectActions.UpdateProject());
        dispatch(HistoryActions.Persist());
      });
  }

  updatePageLayout(change: Partial<BakeryLayout>) {
    getActivePage.pipe(take(1)).subscribe((page: Page) => {
      const layout = this.mergeLayoutWithChanges(change, page.layout);
      dispatch(PageActions.UpdatePage({ id: page.id, layout }));
      dispatch(WorkingAreaActions.SyncState());
      dispatch(ProjectActions.UpdateProject());
      dispatch(HistoryActions.Persist());
    });
  }

  // when user selects header/sidebar and removes it like other components we actually update layout
  removeLayoutComponent(elementToRemove: string) {
    getActivePage
      .pipe(
        take(1),
        combineWith((page: Page) => getRootSpaceForPage(page.id))
      )
      .subscribe(([page, rootSpace]: [Page, PuffComponent]) => {
        const change: Partial<BakeryLayout> = { properties: { [elementToRemove]: false } as any };
        dispatch(ComponentActions.SelectComponent([rootSpace.id]));
        if (page.layout) {
          this.updatePageLayout(change);
        } else {
          this.updateLayout(change);
        }
      });
  }

  private mergeLayoutWithChanges(change: Partial<BakeryLayout>, layout: Partial<BakeryLayout>): BakeryLayout {
    if (!change) {
      return null;
    }

    if (!layout) {
      return change as BakeryLayout;
    }

    return {
      ...layout,
      styles    : {
        ...layout.styles,
        ...change.styles
      },
      properties: {
        ...layout.properties,
        ...change.properties
      }
    };
  }
}
