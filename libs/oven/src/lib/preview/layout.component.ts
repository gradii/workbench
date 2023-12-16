import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { OvenCompiledLayout, OvenSettings, RootComponentType, SpacingService, SyncMsg } from '@common';

import { combineLatest, Observable, Subject } from 'rxjs';

import 'style-loader!../styles/dev-ui-styles.scss';
import 'style-loader!../styles/workbench-styles.scss';
import { Slot, SlotDirective } from '../definitions/definition-utils';
import { DevUIStateService } from '../dev-ui/dev-ui-state.service';
import { ComponentService } from '../renderer/component.service';
import { RenderState } from '../state/render-state.service';

import { LayoutHelper } from '../util/layout-helper.service';
import { filter, map, takeUntil } from 'rxjs/operators';

@Directive({ selector: '[ovenRootHeaderSlot]' })
export class HeaderSlotDirective extends SlotDirective {
}

@Directive({ selector: '[ovenRootSidebarSlot]' })
export class SidebarSlotDirective extends SlotDirective {
}

@Component({
  selector: 'oven-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-layout
      ovenScrollableColumns
      withScroll
      [class.preview]="preview$ | async"
      [class.x-ray]="xRay$ | async"
      [class.header-hidden]="!layout?.properties?.header"
      [class.sidebar-hidden]="!layout?.properties?.sidebar"
    >
      <ng-container
        *ngIf="layout?.properties?.header"
        ovenRootHeaderSlot
        ngProjectAs="nb-layout-header:not([subheader])"
      >
        <ng-template ovenSlotPlaceholder></ng-template>
      </ng-container>

      <ng-container *ngIf="layout?.properties?.sidebar" ovenRootSidebarSlot ngProjectAs="nb-sidebar">
        <ng-template ovenSlotPlaceholder></ng-template>
      </ng-container>

      <nb-layout-column [class.preview]="preview$ | async" [style.padding]="padding">
        <router-outlet></router-outlet>
      </nb-layout-column>
    </nb-layout>
  `,
  providers: [
    { provide: 'headerOven', useClass: ComponentService },
    { provide: 'sidebarOven', useClass: ComponentService }
  ]
})
export class LayoutComponent implements OnInit, OnDestroy {
  layout: OvenCompiledLayout;
  padding: string;
  preview$: Observable<boolean> = this.renderState.showDevUI$.pipe(map((showDevUI: boolean) => !showDevUI));

  xRay$: Observable<boolean> = combineLatest([this.renderState.showDevUI$, this.renderState.settings$]).pipe(
    map(([showDevUI, settings]: [boolean, OvenSettings]) => showDevUI && settings.xray)
  );

  @ViewChild(HeaderSlotDirective) headerSlot: Slot;
  @ViewChild(SidebarSlotDirective) sidebarSlot: Slot;

  private destroyed = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    @Inject('headerOven') private headerOven: ComponentService,
    @Inject('sidebarOven') private sidebarOven: ComponentService,
    private devUIStateService: DevUIStateService,
    private renderState: RenderState,
    private spacingService: SpacingService,
    private layoutHelper: LayoutHelper
  ) {
  }

  ngOnInit() {
    this.layoutHelper.layout$
      .pipe(
        filter((layout: OvenCompiledLayout) => !!layout && this.isLayoutChanged(layout)),
        takeUntil(this.destroyed)
      )
      .subscribe((layout: OvenCompiledLayout) => {
        this.layout = layout;
        this.padding = this.spacingService.getPaddingCssValue(layout.styles.paddings);
        this.cd.detectChanges();
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
    this.headerOven.clear();
    this.sidebarOven.clear();
  }

  private bakeLayout(syncMsg: SyncMsg) {
    if (this.layout.properties.header) {
      const comps = this.headerOven.bake(
        this.headerSlot,
        syncMsg.state.header.slots.content,
        RootComponentType.Header,
        syncMsg.syncReason
      );
      this.devUIStateService.setHeaderComponents(comps);
    } else {
      this.headerOven.clear();
    }

    if (this.layout.properties.sidebar) {
      const comps = this.sidebarOven.bake(
        this.sidebarSlot,
        syncMsg.state.sidebar.slots.content,
        RootComponentType.Sidebar,
        syncMsg.syncReason
      );
      this.devUIStateService.setSidebarComponents(comps);
    } else {
      this.sidebarOven.clear();
    }
  }

  private isLayoutChanged(newLayout: OvenCompiledLayout): boolean {
    if (newLayout && !this.layout) {
      return true;
    }
    return !this.layoutHelper.isLayoutEquals(this.layout, newLayout);
  }
}
