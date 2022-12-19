import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';

import { LayoutFacade } from '@tools-state/layout/layout-facade.service';
import { BakeryLayout } from '@tools-state/layout/layout.model';
import { PageFacade } from '@tools-state/page/page-facade.service';
import { Page } from '@tools-state/page/page.model';
import { fromTools } from '@tools-state/tools.reducer';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';

@Component({
  selector       : 'len-layout-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./layout-panel.component.scss'],
  template       : `
    <tri-tab-group [selectedIndex]="1" class="sub-tabs">
      <tri-tab>
        <div *triTabLabel>
          <tri-icon svgIcon="outline:file"></tri-icon>
          Current page
        </div>
        <pf-layout-editor
          [forPage]="true"
          [layout]="pageLayout$ | async"
          [globalLayout]="layout$ | async"
          (layoutChange)="onPageLayoutChange($event)"
        ></pf-layout-editor>
      </tri-tab>
      <tri-tab>
        <div *triTabLabel>
          <tri-icon svgIcon="outline:home"></tri-icon>
          General
        </div>
        <tri-icon *triTabLabel svgIcon="outline:file"></tri-icon>
        <pf-layout-editor [layout]="layout$ | async" (layoutChange)="onLayoutChange($event)"></pf-layout-editor>
      </tri-tab>
    </tri-tab-group>
  `
})
export class LayoutPanelComponent {
  private breakpoint$ = getSelectedBreakpoint.pipe(shareReplay());

  layout$: Observable<BakeryLayout> = combineLatest([this.breakpoint$, this.layoutFacade.layout$]).pipe(
    map(([_, layout]) => ({ ...layout }))
  );

  pageLayout$: Observable<BakeryLayout> = combineLatest([this.breakpoint$, this.pageFacade.activePage$]).pipe(
    map(([_, page]) => page),
    filter((page: Page) => !!page),
    map((page: Page) => page.layout)
  );

  constructor(
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
