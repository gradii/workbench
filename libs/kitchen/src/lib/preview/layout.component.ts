import {
  ChangeDetectionStrategy, Component, Directive, Inject, OnDestroy, OnInit, ViewChild, ɵdetectChanges
} from '@angular/core';
import {
  KitchenCompiledLayout, KitchenComponent, KitchenSettings, RootComponentType, SpacingService, SyncMsg
} from '@common/public-api';

import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

// import '../styles/dev-ui-styles.scss';
// import '../styles/workbench-styles.scss';
import { Slot, SlotDirective } from '../definitions/definition-utils';
import { DevUIStateService } from '../dev-ui/dev-ui-state.service';
import { ComponentService } from '../renderer/component.service';
import { RenderState } from '../state/render-state.service';

import { LayoutHelper } from '../util/layout-helper.service';

@Directive({ selector: '[kitchenRootHeaderSlot]' })
export class HeaderSlotDirective extends SlotDirective {
}

@Directive({ selector: '[kitchenRootSidebarSlot]' })
export class SidebarSlotDirective extends SlotDirective {
}

@Component({
  selector       : 'kitchen-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./layout.component.scss'],
  template       : `
    <tri-layout
      [class.preview]="preview$ | async"
      [class.x-ray]="xRay$ | async"
      [class.header-hidden]="!layout?.properties?.header"
      [class.sidebar-hidden]="!layout?.properties?.sidebar"
    >
      <ng-container
        *ngIf="layout?.properties?.header"
        kitchenRootHeaderSlot
        ngProjectAs="tri-layout-header:not([subheader])"
      >
        <ng-template kitchenSlotPlaceholder></ng-template>
      </ng-container>

      <ng-container *ngIf="layout?.properties?.sidebar"
                    kitchenRootSidebarSlot
                    ngProjectAs="tri-sidebar">
        <ng-template kitchenSlotPlaceholder></ng-template>
      </ng-container>

      <div [class.preview]="preview$ | async" [style.padding]="padding">
        <kitchen-page2
          (transferArrayItem)="onTransferArrayItem($event)"
          (moveItemInArray)="onMoveItemInArray($event)"
        ></kitchen-page2>
        <!--        <router-outlet></router-outlet>-->

        <div class="pf-layout-view-section-add">
          <div class="pf-layout-view-section-add-wrapper">
            <div class="pf-layout-view-section-add-icon">
              <div>添加内容区域</div>
            </div>
          </div>
        </div>
      </div>
    </tri-layout>
  `,
  providers      : [
    { provide: 'headerKitchen', useClass: ComponentService },
    { provide: 'sidebarKitchen', useClass: ComponentService }
  ]
})
export class LayoutComponent implements OnInit, OnDestroy {
  layout: KitchenCompiledLayout;
  padding: string;
  preview$: Observable<boolean> = this.renderState.showDevUI$.pipe(map((showDevUI: boolean) => !showDevUI));

  xRay$: Observable<boolean> = combineLatest([this.renderState.showDevUI$, this.renderState.settings$]).pipe(
    map(([showDevUI, settings]: [boolean, KitchenSettings]) => showDevUI && settings.xray)
  );

  @ViewChild(HeaderSlotDirective) headerSlot: Slot;
  @ViewChild(SidebarSlotDirective) sidebarSlot: Slot;

  private destroyed = new Subject<void>();

  constructor(
    @Inject('headerKitchen') private headerKitchen: ComponentService,
    @Inject('sidebarKitchen') private sidebarKitchen: ComponentService,
    private devUIStateService: DevUIStateService,
    private renderState: RenderState,
    private spacingService: SpacingService,
    private layoutHelper: LayoutHelper
  ) {
  }

  onTransferArrayItem(event: {
    component: any,
    currentContainer: any,
    targetContainer: any,
    currentIndex: number,
    targetIndex: number
  }) {

    console.log(event);
    const { component, currentContainer, targetContainer, currentIndex, targetIndex } = event;

    // check drag container item
    if (!currentContainer?.slotId) {
      const addKitchenComponent = component.factory();
      this.renderState.addItem({
        component   : addKitchenComponent,
        parentSlotId: targetContainer.slotId,
        index       : targetIndex
      });
    } else {
      this.renderState.transferArrayItem({
        component,
        currentContainer,
        targetContainer,
        currentIndex,
        targetIndex
      });
    }
  }

  onMoveItemInArray(event: {
    component: KitchenComponent,
    currentContainer: any,
    currentIndex: number,
    targetIndex: number
  }) {
    const { component, currentContainer, currentIndex, targetIndex } = event;

    this.renderState.moveItemInArray({
      component,
      parentSlotId: component.parentSlotId,
      currentContainer,
      currentIndex,
      targetIndex
    });
  }

  ngOnInit() {
    this.layoutHelper.layout$
      .pipe(
        filter((layout: KitchenCompiledLayout) => !!layout && this.isLayoutChanged(layout)),
        takeUntil(this.destroyed)
      )
      .subscribe((layout: KitchenCompiledLayout) => {
        this.layout  = layout;
        this.padding = this.spacingService.getPaddingCssValue(layout.styles.paddings);
        ɵdetectChanges(this);
      });

    combineLatest([this.renderState.syncMsg$, this.layoutHelper.layout$])
      .pipe(
        map(([syncMsg]) => syncMsg),
        filter(() => !!this.layout),
        takeUntil(this.destroyed)
      )
      .subscribe((syncMsg: SyncMsg) => this.bakeLayout(syncMsg));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.headerKitchen.clear();
    this.sidebarKitchen.clear();
  }

  private bakeLayout(syncMsg: SyncMsg) {
    if (this.layout.properties.header) {
      const comps = this.headerKitchen.cook(
        this.headerSlot,
        syncMsg.state.header.slots.content,
        RootComponentType.Header,
        syncMsg.syncReason
      );
      this.devUIStateService.setHeaderComponents(comps);
    } else {
      this.headerKitchen.clear();
    }

    if (this.layout.properties.sidebar) {
      const comps = this.sidebarKitchen.cook(
        this.sidebarSlot,
        syncMsg.state.sidebar.slots.content,
        RootComponentType.Sidebar,
        syncMsg.syncReason
      );
      this.devUIStateService.setSidebarComponents(comps);
    } else {
      this.sidebarKitchen.clear();
    }
  }

  private isLayoutChanged(newLayout: KitchenCompiledLayout): boolean {
    if (newLayout && !this.layout) {
      return true;
    }
    return !this.layoutHelper.isLayoutEquals(this.layout, newLayout);
  }
}
