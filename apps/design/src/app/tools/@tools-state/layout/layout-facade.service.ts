import { Injectable } from '@angular/core';
import { combineWith } from '@common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { BakeryComponent } from '@tools-state/component/component.model';
import { ComponentActions } from '@tools-state/component/component.actions';
import { LayoutActions } from '@tools-state/layout/layout.actions';
import { PageActions } from '@tools-state/page/page.actions';
import { HistoryActions } from '@tools-state/history/history.actions';
import { Page } from '@tools-state/page/page.model';
import { getActivePage, getRootSpaceForPage } from '@tools-state/page/page.selectors';
import { ProjectActions } from '@tools-state/project/project.actions';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { BakeryLayout } from '@tools-state/layout/layout.model';
import { getLayout } from '@tools-state/layout/layout.selectors';
import { fromTools } from '@tools-state/tools.reducer';

@Injectable({ providedIn: 'root' })
export class LayoutFacade {
  readonly layout$: Observable<BakeryLayout> = this.store.pipe(
    select(getLayout),
    filter(layout => !!layout)
  );

  constructor(private store: Store<fromTools.State>) {
  }

  updateLayout(change: Partial<BakeryLayout>) {
    this.store
      .pipe(
        take(1),
        select(getLayout),
        map((layout: BakeryLayout) => this.mergeLayoutWithChanges(change, layout))
      )
      .subscribe((layout: BakeryLayout) => {
        this.store.dispatch(new LayoutActions.UpdateLayout(layout));
        this.store.dispatch(new WorkingAreaActions.SyncState());
        this.store.dispatch(new ProjectActions.UpdateProject());
        this.store.dispatch(new HistoryActions.Persist());
      });
  }

  updatePageLayout(change: Partial<BakeryLayout>) {
    this.store.pipe(select(getActivePage), take(1)).subscribe((page: Page) => {
      const layout = this.mergeLayoutWithChanges(change, page.layout);
      this.store.dispatch(new PageActions.UpdatePage({ id: page.id, changes: { layout } }));
      this.store.dispatch(new WorkingAreaActions.SyncState());
      this.store.dispatch(new ProjectActions.UpdateProject());
      this.store.dispatch(new HistoryActions.Persist());
    });
  }

  // when user selects header/sidebar and removes it like other components we actually update layout
  removeLayoutComponent(elementToRemove: string) {
    this.store
      .pipe(
        select(getActivePage),
        take(1),
        combineWith((page: Page) => this.store.pipe(select(getRootSpaceForPage, page.id)))
      )
      .subscribe(([page, rootSpace]: [Page, BakeryComponent]) => {
        const change: Partial<BakeryLayout> = { properties: { [elementToRemove]: false } as any };
        this.store.dispatch(new ComponentActions.SelectComponent([rootSpace.id]));
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
      styles: {
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
