import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { filter, map, pluck, shareReplay, switchMap } from 'rxjs/operators';

import { BreakpointWidth, OvenApp, OvenComponent, OvenPage, OvenSlot } from '@common';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { PageFacade } from '@tools-state/page/page-facade.service';
import { fromTools } from '@tools-state/tools.reducer';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';
import { ComponentTreeNode } from './components-tree.model';
import { getOvenApp } from '@tools-state/working-area/working-area.selectors';
import { ComponentSettingsService } from '../component-settings/component-settings.service';

@Injectable({ providedIn: 'root' })
export class ComponentsTreeService {
  private readonly ovenApp$: Observable<OvenApp> = this.store.pipe(
    select(getOvenApp),
    filter((app: OvenApp) => !!app),
    shareReplay()
  );

  private readonly header$: Observable<ComponentTreeNode[]> = this.ovenApp$.pipe(
    map((app: OvenApp) => {
      if (!app.layout.properties.header) {
        return [];
      }

      const { content } = app.header.slots;
      return content.componentList
        .map(component => this.getTreeComponents(component, content.id))
        .reduce(this.mergeArrays, []);
    })
  );

  private readonly sidebar$: Observable<ComponentTreeNode[]> = this.ovenApp$.pipe(
    map((app: OvenApp) => {
      if (!app.layout.properties.sidebar) {
        return [];
      }

      const { content } = app.sidebar.slots;
      return content.componentList
        .map(component => this.getTreeComponents(component, content.id))
        .reduce(this.mergeArrays, []);
    })
  );

  private readonly pageList$: Observable<ComponentTreeNode[]> = this.ovenApp$.pipe(
    pluck('pageList'),
    map(pages => this.flattenPages(pages)),
    switchMap(pages => this.getActivePage(pages)),
    filter(page => Boolean(page)),
    pluck('slots', 'content'),
    map((content: OvenSlot) =>
      content.componentList
        .map(component => this.getTreeComponents(component, content.id))
        .reduce(this.mergeArrays, [])
    )
  );

  readonly componentList$: Observable<ComponentTreeNode[]> = combineLatest([
    this.header$,
    this.sidebar$,
    this.pageList$
  ]).pipe(
    map(([header, sidebar, pageList]) => [...header, ...sidebar, ...pageList]),
    map(this.setParentIndex)
  );

  readonly selectedBreakpoint$: Observable<Breakpoint> = this.store.pipe(select(getSelectedBreakpoint));

  constructor(
    private store: Store<fromTools.State>,
    private stateConverterService: StateConverterService,
    private componentSettingsService: ComponentSettingsService,
    private pageFacade: PageFacade,
    private actions$: Actions
  ) {
  }

  public getTreeComponents(
    ovenComponent: OvenComponent,
    parentSlotId: string,
    parentSlotName: string = 'content',
    parentDefinitionId?: string,
    index?: number,
    level: number = 0
  ): ComponentTreeNode[] {
    const newComponent = this.getNewBakeryTreeComponent(
      parentSlotId,
      ovenComponent,
      level,
      parentSlotName,
      parentDefinitionId,
      index
    );
    const response: ComponentTreeNode[] = [newComponent];
    if (Object.keys(ovenComponent.slots)) {
      response.push(...this.getChildrenListFromSlots(ovenComponent.slots, ovenComponent.definitionId, level + 1));
    }
    return response;
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
    let parentIndex = component.parentIndex;

    while (parentIndex !== null) {
      parentIndexes.push(parentIndex);
      const parentComponent = components[parentIndex];
      parentIndex = parentComponent ? parentComponent.parentIndex : null;
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
    const slotsAmount = Object.keys(component.ovenComponent.slots).length;
    const isHaveChildren = Object.entries(component.ovenComponent.slots).reduce((acc, [, slot]) => {
      return acc || Boolean(slot.componentList && slot.componentList.length);
    }, false);
    return slotsAmount && isHaveChildren;
  }

  public isVisible(component: ComponentTreeNode, breakpointWidth: string): boolean {
    let visible = this.getVisibleStatus(component, breakpointWidth);
    if (typeof visible === 'boolean') {
      return visible;
    }

    const breakpoints = Object.entries(BreakpointWidth).reverse();
    const currentBreakpointIndex = breakpoints.findIndex(([, bp]) => bp === breakpointWidth);

    for ([, breakpointWidth] of breakpoints.slice(currentBreakpointIndex)) {
      visible = this.getVisibleStatus(component, breakpointWidth);
      if (typeof visible === 'boolean') {
        return visible;
      }
    }
    return true;
  }

  public getVisibleStatus(component: ComponentTreeNode, breakpointWidth: string): boolean {
    const visibleStyle = component.ovenComponent.styles[breakpointWidth];
    return visibleStyle ? visibleStyle.visible : null;
  }

  private flattenPages(pages: OvenPage[]): OvenPage[] {
    const pagesToProcess: OvenPage[] = [...pages];
    const res: OvenPage[] = [];

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
    ovenComponent,
    level,
    parentSlotName,
    parentDefinitionId,
    index
  ): ComponentTreeNode {
    const newComponent = new ComponentTreeNode(parentSlotId, ovenComponent, level);
    newComponent.fullName = this.componentSettingsService.getFullComponentName(
      parentSlotName,
      parentDefinitionId,
      index + 1
    );
    return newComponent;
  }

  private getChildrenListFromSlots(
    slots: { [key: string]: OvenSlot },
    parentDefinitionId: string,
    level: number
  ): ComponentTreeNode[] {
    return Object.entries(slots)
      .map(([key, el], index) => {
        return el.componentList
          .map(comp => this.getTreeComponents(comp, el.id, key, parentDefinitionId, index, level))
          .reduce(this.mergeArrays, []);
      })
      .reduce(this.mergeArrays, []);
  }

  private mergeArrays(source: any[], target: any[]): any[] {
    return [source, target].flat(1);
  }

  private getActivePage(pages: OvenPage[]): Observable<OvenPage> {
    return this.pageFacade.activePage$.pipe(
      filter(activePage => !!activePage),
      map(activePage => pages.find(page => page.id === activePage.id))
    );
  }

  private setParentIndex(components: ComponentTreeNode[]): ComponentTreeNode[] {
    const parentIndexes: number[] = [];
    return components.map((component, i) => {
      if (i === 0) {
        return component;
      }

      const prevIndex = i - 1;
      if (component.level > components[prevIndex].level) {
        parentIndexes.push(prevIndex);
      } else if (component.level < components[prevIndex].level) {
        for (let index = component.level; index < components[prevIndex].level; index++) {
          parentIndexes.pop();
        }
      }

      component.parentIndex = parentIndexes[parentIndexes.length - 1];
      return component;
    });
  }
}
