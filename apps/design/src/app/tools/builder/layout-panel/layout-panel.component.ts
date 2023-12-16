import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { LayoutFacade } from '@tools-state/layout/layout-facade.service';
import { BakeryLayout } from '@tools-state/layout/layout.model';
import { PageFacade } from '@tools-state/page/page-facade.service';
import { fromTools } from '@tools-state/tools.reducer';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';
import { Page } from '@tools-state/page/page.model';

@Component({
  selector: 'ub-layout-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./layout-panel.component.scss'],
  template: `
    <nb-tabset class="sub-tabs">
      <nb-tab tabTitle="Current page" tabIcon="file-outline">
        <ub-layout-settings
          [forPage]="true"
          [layout]="pageLayout$ | async"
          [globalLayout]="layout$ | async"
          (layoutChange)="onPageLayoutChange($event)"
        ></ub-layout-settings>
      </nb-tab>
      <nb-tab active tabTitle="General" tabIcon="browser-outline">
        <ub-layout-settings [layout]="layout$ | async" (layoutChange)="onLayoutChange($event)"></ub-layout-settings>
      </nb-tab>
    </nb-tabset>
  `
})
export class LayoutPanelComponent {
  private breakpoint$ = this.store.pipe(select(getSelectedBreakpoint), shareReplay());

  layout$: Observable<BakeryLayout> = combineLatest([this.breakpoint$, this.layoutFacade.layout$]).pipe(
    map(([_, layout]) => ({ ...layout }))
  );

  pageLayout$: Observable<BakeryLayout> = combineLatest([this.breakpoint$, this.pageFacade.activePage$]).pipe(
    map(([_, page]) => page),
    filter((page: Page) => !!page),
    map((page: Page) => page.layout)
  );

  constructor(
    private store: Store<fromTools.State>,
    private pageFacade: PageFacade,
    private layoutFacade: LayoutFacade
  ) {
  }

  onLayoutChange(change: Partial<BakeryLayout>) {
    this.layoutFacade.updateLayout(change);
  }

  onPageLayoutChange(change: Partial<BakeryLayout>) {
    this.layoutFacade.updatePageLayout(change);
  }
}
