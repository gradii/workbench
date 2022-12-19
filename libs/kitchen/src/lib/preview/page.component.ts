import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KitchenApp, KitchenPage, RootComponentType, SyncMsg, SyncReasonMsg } from '@common/public-api';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Slot, SlotDirective } from '../definitions';
import { DevUIStateService } from '../dev-ui/dev-ui-state.service';

import { ComponentService } from '../renderer/component.service';
import { KitchenState } from '../state/kitchen-state.service';
import { RenderState } from '../state/render-state.service';

export interface SyncPage {
  state: KitchenApp;
  page: KitchenPage;
  syncReason: SyncReasonMsg;
}

@Component({
  selector       : 'kitchen-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./page.component.scss'],
  template       : `
    <div kitchenSlot>
      <ng-template kitchenSlotPlaceholder></ng-template>
    </div>
  `,
  providers      : [ComponentService]
})
export class PageComponent implements AfterViewInit, OnDestroy {
  @ViewChild(SlotDirective) slot: Slot;

  private destroyed = new Subject<void>();

  private page$: Observable<SyncPage> = combineLatest([this.renderState.syncMsg$, this.route.data]).pipe(
    map(([{ state, syncReason }, routePage]: [SyncMsg, KitchenPage]) => {
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
    private kitchenState: KitchenState
  ) {
  }

  ngAfterViewInit() {
    this.page$.subscribe(({ page, syncReason }: SyncPage) => {
      this.kitchenState.setActivePage(page);
      const comps = this.componentService.cook(
        this.slot,
        page.slots.content,
        RootComponentType.Page,
        syncReason
      );
      this.devUIStateService.setPageComponents(comps);
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.componentService.clear();
  }
}
