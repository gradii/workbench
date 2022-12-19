import { Injectable } from '@angular/core';

import { BreakpointWidth, KitchenApp, KitchenComponent, KitchenPage, KitchenSlot } from '@common/public-api';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';
import { PageFacade } from '@tools-state/page/page-facade.service';
import { getKitchenApp } from '@tools-state/working-area/working-area.selectors';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, pluck, shareReplay, switchMap } from 'rxjs/operators';
import { ComponentSettingsService } from '../component-inspection/component-settings.service';
import { ComponentOrSlotTreeNode, ComponentTreeNode, SlotTreeNode } from './components-tree.model';

@Injectable({ providedIn: 'root' })
export class ComponentsTreeService {
  private readonly kitchenApp$: Observable<KitchenApp> = getKitchenApp.pipe(
    filter((app: KitchenApp) => !!app),
    shareReplay()
  );

  private readonly header$: Observable<ComponentOrSlotTreeNode[]> = this.kitchenApp$.pipe(
    map((app: KitchenApp) => {
      if (!app.layout.properties.header) {
        return [];
      }

      const { content } = app.header.slots;
      return content.componentList
        .map(component => this.getTreeComponents(component, content.id));
    })
  );

  private readonly sidebar$: Observable<ComponentOrSlotTreeNode[]> = this.kitchenApp$.pipe(
    map((app: KitchenApp) => {
      if (!app.layout.properties.sidebar) {
        return [];
      }

      const { content } = app.sidebar.slots;
      return content.componentList
        .map(component => this.getTreeComponents(component, content.id));
    })
  );

  private readonly pageList$: Observable<ComponentOrSlotTreeNode[]> = this.kitchenApp$.pipe(
    pluck('pageList'),
    map(pages => this.flattenPages(pages)),
    switchMap(pages => this.getActivePage(pages)),
    filter(page => Boolean(page)),
    pluck('slots', 'content'),
    map((content: KitchenSlot) =>
      content.componentList
        .map(component => this.getTreeComponents(component, content.id))
    )
  );

  readonly componentList$: Observable<ComponentOrSlotTreeNode[]> = combineLatest([
    this.header$,
    this.sidebar$,
    this.pageList$
  ]).pipe(
    map(([
           header,
           sidebar,
           pageList
         ]) => [
      ...header,
      ...sidebar,
      ...pageList
    ])
  );

  readonly selectedBreakpoint$: Observable<Breakpoint> = getSelectedBreakpoint;

  constructor(
    private stateConverterService: StateConverterService,
    private componentSettingsService: ComponentSettingsService,
    private pageFacade: PageFacade
  ) {
  }

  public getTreeComponents(
    kitchenComponent: KitchenComponent,
    parentSlotId: string,
    parentSlotName: string = 'content',
    parentDefinitionId?: string,
    index?: number,
    level: number          = 0
  ): ComponentOrSlotTreeNode {
    const newComponent = this.getNewBakeryTreeComponent(
      parentSlotId,
      kitchenComponent,
      level,
      parentSlotName,
      parentDefinitionId,
      index
    );

    newComponent.children = this.getChildrenListFromSlots(
      kitchenComponent.slots,
      kitchenComponent.definitionId,
      level + 1
    );
    return newComponent;
  }

  public getChildrenIndexes(
    components: ComponentTreeNode[],
    parentIndex: number,
    includeWithoutChildren: boolean = false
  ): number[] {
    const childrenIndexes: number[] = components.reduce((acc, cur, i) => {
      if (cur.parentIndex === parentIndex && (this.isCanBeOpen(cur) || includeWithoutChildren)) {
        return [...acc, i];
      }
      return acc;
    }, []);

    if (!childrenIndexes.length) {
      return [];
    }

    return this.mergeArrays(
      childrenIndexes,
      childrenIndexes.reduce(
        (acc, cur) => this.mergeArrays(acc, this.getChildrenIndexes(components, cur, includeWithoutChildren)),
        []
      )
    );
  }

  public getParentIndexes(components: ComponentTreeNode[], component: ComponentTreeNode): number[] {
    const parentIndexes: number[] = [];
    let parentIndex               = component.parentIndex;

    while (parentIndex !== null) {
      parentIndexes.push(parentIndex);
      const parentComponent = components[parentIndex];
      parentIndex           = parentComponent ? parentComponent.parentIndex : null;
    }
    return parentIndexes;
  }

  public getInvisibleChildrenIndexes(components: ComponentTreeNode[], breakpointWidth: string): number[] {
    return components.reduce((acc, cur, i) => {
      const visible = this.isVisible(cur, breakpointWidth);
      if (!visible) {
        return [...acc, i, ...this.getChildrenIndexes(components, i, true)];
      }
      return acc;
    }, []);
  }

  public isCanBeOpen(component: ComponentTreeNode) {
    const slotsAmount    = Object.keys(component.kitchenComponent.slots).length;
    const isHaveChildren = Object.entries(component.kitchenComponent.slots).reduce((acc, [, slot]) => {
      return acc || Boolean(slot.componentList && slot.componentList.length);
    }, false);
    return slotsAmount && isHaveChildren;
  }

  public isVisible(component: ComponentTreeNode, breakpointWidth: string): boolean {
    let visible = this.getVisibleStatus(component, breakpointWidth);
    if (typeof visible === 'boolean') {
      return visible;
    }

    const breakpoints            = Object.entries(BreakpointWidth).reverse();
    const currentBreakpointIndex = breakpoints.findIndex(([, bp]) => bp === breakpointWidth);

    for ([, breakpointWidth] of breakpoints.slice(currentBreakpointIndex)) {
      visible = this.getVisibleStatus(component, breakpointWidth);
      if (typeof visible === 'boolean') {
        return visible;
      }
    }
    return true;
  }

  public getVisibleStatus(component: ComponentTreeNode | SlotTreeNode, breakpointWidth: string): boolean {
    if (component instanceof ComponentTreeNode) {
      const visibleStyle = component.kitchenComponent.styles[breakpointWidth];
      return visibleStyle ? visibleStyle.visible : null;
    } else {
      return true;
    }
  }

  private flattenPages(pages: KitchenPage[]): KitchenPage[] {
    const pagesToProcess: KitchenPage[] = [...pages];
    const res: KitchenPage[]            = [];

    for (const page of pagesToProcess) {
      res.push(page);

      if (page.pageList) {
        res.push(...this.flattenPages(page.pageList));
      }
    }

    return res;
  }

  private getNewBakeryTreeComponent(
    parentSlotId,
    kitchenComponent,
    level,
    parentSlotName,
    parentDefinitionId,
    index
  ): ComponentTreeNode {
    const newComponent    = new ComponentTreeNode(parentSlotId, kitchenComponent, level);
    // newComponent.fullName = newComponent.kitchenComponent.properties.name;
    /*this.componentSettingsService.getFullComponentName(
      parentSlotName,
      parentDefinitionId,
      index + 1
    ); */
    return newComponent;
  }

  private getChildrenListFromSlots(
    slots: { [key: string]: KitchenSlot },
    parentDefinitionId: string,
    level: number
  ): ComponentOrSlotTreeNode[] {
    if (!slots) {
      return [];
    }
    const rst = [];
    Object.entries(slots)
      .forEach(([key, slot], index) => {
        if (key === 'content') {
          slot.componentList.forEach(comp => {
            rst.push(this.getTreeComponents(comp, slot.id, key, parentDefinitionId, index, level));
          });
        } else {
          const slotTreeNode    = new SlotTreeNode(parentDefinitionId, slot, level);
          slotTreeNode.fullName = `slot-${key}`;
          slotTreeNode.children = slot.componentList.map(comp => {
            return this.getTreeComponents(comp, slot.id, key, parentDefinitionId, index, level);
          });
          rst.push(slotTreeNode);
        }
      });
    return rst;
  }

  private mergeArrays(source: any[], target: any[]): any[] {
    return [source, target].flat(1);
  }

  private getActivePage(pages: KitchenPage[]): Observable<KitchenPage> {
    return this.pageFacade.activePage$.pipe(
      filter(activePage => !!activePage),
      map(activePage => pages.find(page => page.id === activePage.id))
    );
  }
}
