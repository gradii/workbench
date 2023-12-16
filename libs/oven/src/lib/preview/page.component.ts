import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OvenPage, SyncMsg, SyncReasonMsg, RootComponentType, OvenApp } from '@common';
import { filter, map, takeUntil } from 'rxjs/operators';
import { combineLatest, Observable, Subject } from 'rxjs';

import { ComponentService } from '../renderer/component.service';
import { Slot, SlotDirective } from '../definitions';
import { RenderState } from '../state/render-state.service';
import { OvenState } from '../state/oven-state.service';
import { DevUIStateService } from '../dev-ui/dev-ui-state.service';

export interface SyncPage {
  state: OvenApp;
  page: OvenPage;
  syncReason: SyncReasonMsg;
}

@Component({
  selector: 'oven-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./page.component.scss'],
  template: `
    <div ovenSlot>
      <ng-template ovenSlotPlaceholder></ng-template>
    </div>
  `,
  providers: [ComponentService]
})
export class PageComponent implements AfterViewInit, OnDestroy {
  @ViewChild(SlotDirective) slot: Slot;

  private destroyed = new Subject<void>();

  private page$: Observable<SyncPage> = combineLatest([this.renderState.syncMsg$, this.route.data]).pipe(
    map(([{ state, syncReason }, routePage]: [SyncMsg, OvenPage]) => {
      const pagesToSearch = [...state.pageList];
      for (const page of pagesToSearch) {
        if (page.id === routePage.id) {
          return { page, syncReason, state };
        }
        pagesToSearch.push(...page.pageList);
      }
    }),
    filter((m: SyncPage) => m && !!m.page),
    takeUntil(this.destroyed)
  );

  constructor(
    private componentService: ComponentService,
    private route: ActivatedRoute,
    private devUIStateService: DevUIStateService,
    private renderState: RenderState,
    private ovenState: OvenState
  ) {
  }

  ngAfterViewInit() {
    this.page$.subscribe(({ page, syncReason }: SyncPage) => {
      this.ovenState.setActivePage(page);
      const comps = this.componentService.bake(this.slot, page.slots.content, RootComponentType.Page, syncReason);
      this.devUIStateService.setPageComponents(comps);
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.componentService.clear();
  }
}
