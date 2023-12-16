import { Injectable } from '@angular/core';
import {
  definitionIdToScheme,
  OvenApp,
  OvenComponent,
  OvenHeader,
  OvenPage,
  OvenSidebar,
  OvenSlot,
  UIPropertyMetaData
} from '@common';

import { BakeryApp } from '@tools-state/app/app.model';
import { BakeryComponent } from '@tools-state/component/component.model';
import { Page, PageTreeNode } from '@tools-state/page/page.model';
import { Slot } from '@tools-state/slot/slot.model';

@Injectable({ providedIn: 'root' })
export class StateConverterService {
  // TODO performance hotfix, refactor communication when it'll be possible
  convertActivePageState(app: BakeryApp, activePage: Page): OvenApp {
    if (!activePage) {
      return;
    }

    return {
      routes: this.createRoutes(app.rootPageList),
      pageList: this.createPage(app, activePage),
      header: this.buildLayoutPart(app.componentList, app.slotList, 'headerSlot'),
      sidebar: this.buildLayoutPart(app.componentList, app.slotList, 'sidebarSlot'),
      layout: app.layout,
      theme: app.theme,
      workflowList: app.workflowList,
      storeItemList: app.storeItemList,
      favicon: app.favicon,
      code: app.code,
      uiPropertyData: this.getUIPropertyData(app)
    };
  }

  private createPage(app: BakeryApp, page: Page): OvenPage[] {
    const ovenPage: OvenPage = {
      id: page.id,
      title: page.name,
      url: page.url,
      layout: page.layout,
      pageList: [],
      slots: this.getPageSlots(page as PageTreeNode, app.componentList, app.slotList)
    };

    return [ovenPage];
  }

  private createRoutes(pages: PageTreeNode[]): any[] {
    const routes = [];

    for (const page of pages) {
      const route = { url: page.url, title: page.name, id: page.id, pageList: [] };

      if (page.children && page.children.length) {
        route.pageList = this.createRoutes(page.children);
      }

      routes.push(route);
    }

    return routes;
  }

  convertState(app: BakeryApp): OvenApp {
    return {
      pageList: this.convertPageList(app.rootPageList, app.componentList, app.slotList),
      header: this.buildLayoutPart(app.componentList, app.slotList, 'headerSlot'),
      sidebar: this.buildLayoutPart(app.componentList, app.slotList, 'sidebarSlot'),
      layout: app.layout,
      theme: app.theme,
      workflowList: app.workflowList,
      storeItemList: app.storeItemList,
      favicon: app.favicon,
      code: app.code,
      uiPropertyData: this.getUIPropertyData(app)
    };
  }

  convertOvenComponent(component: OvenComponent): BakeryComponent {
    return {
      id: component.id,
      definitionId: component.definitionId,
      styles: component.styles,
      properties: component.properties,
      index: component.index,
      actions: component.actions,
      parentSlotId: ''
    };
  }

  /**
   * Iterates over component sub entities and generate all slots and components.
   * */
  getSubEntities(component: OvenComponent): { slots: Slot[]; components: BakeryComponent[] } {
    const subEntities = { slots: [], components: [] };

    const componentListToExtractChildren: OvenComponent[] = [component];
    for (const parent of componentListToExtractChildren) {
      if (!parent.slots) {
        continue;
      }

      for (const [slotName, slot] of Object.entries(parent.slots)) {
        subEntities.slots.push({
          id: slot.id,
          name: slotName,
          parentComponentId: parent.id
        });

        for (const child of slot.componentList) {
          const cmpToPush: BakeryComponent = {
            id: child.id,
            definitionId: child.definitionId,
            styles: child.styles,
            properties: child.properties,
            parentSlotId: slot.id,
            // the index might already be defined by widgets configuration
            index: child.index || 0
          };

          if (child.actions) {
            cmpToPush.actions = child.actions;
          }

          subEntities.components.push(cmpToPush);
          componentListToExtractChildren.push(child);
        }
      }
    }

    return subEntities;
  }

  private convertPageList(
    rootPageList: PageTreeNode[],
    componentList: BakeryComponent[],
    slotList: Slot[]
  ): OvenPage[] {
    return rootPageList.map((page: PageTreeNode) => ({
      id: page.id,
      title: page.name,
      url: page.url,
      layout: page.layout,
      pageList: this.convertPageList(page.children, componentList, slotList),
      slots: this.getPageSlots(page, componentList, slotList)
    }));
  }

  private buildLayoutPart(
    componentList: BakeryComponent[],
    slotList: Slot[],
    layoutSlotName: string
  ): OvenHeader | OvenSidebar {
    const layoutSlot = slotList.find((slot: Slot) => slot[layoutSlotName]);
    const slotComponents: OvenComponent[] = this.getSlotComponentList(layoutSlot.id, componentList, slotList);
    return {
      slots: {
        content: new OvenSlot(slotComponents, layoutSlot.id)
      }
    };
  }

  private getPageSlots(page: PageTreeNode, componentList: BakeryComponent[], slotList: Slot[]): { content: OvenSlot } {
    const slotData: Slot = slotList.find((slot: Slot) => slot.parentPageId === page.id);
    const slotComponents: OvenComponent[] = this.getSlotComponentList(slotData.id, componentList, slotList);

    return { content: new OvenSlot(slotComponents, slotData.id) };
  }

  private getSlotComponentList(slotId: string, componentList: BakeryComponent[], slotList: Slot[]): OvenComponent[] {
    return componentList
      .filter((component: BakeryComponent) => component.parentSlotId === slotId)
      .map((component: BakeryComponent) => this.convertComponent(component, componentList, slotList))
      .sort((a, b) => a.index - b.index);
  }

  private convertComponent(
    component: BakeryComponent,
    componentList: BakeryComponent[],
    slotList: Slot[]
  ): OvenComponent {
    return {
      id: component.id,
      definitionId: component.definitionId,
      styles: component.styles,
      properties: component.properties,
      actions: component.actions,
      slots: this.getComponentSlots(component, componentList, slotList),
      index: component.index
    };
  }

  private getComponentSlots(
    component: BakeryComponent,
    componentList: BakeryComponent[],
    slotList: Slot[]
  ): { [key: string]: OvenSlot } {
    const slots = {};
    const slotsL = slotList.filter((slot: Slot) => slot.parentComponentId === component.id);

    for (const slot of slotsL) {
      const comps = componentList
        .filter((comp: BakeryComponent) => comp.parentSlotId === slot.id)
        .map((comp: BakeryComponent) => this.convertComponent(comp, componentList, slotList))
        .sort((a, b) => a.index - b.index);

      slots[slot.name] = new OvenSlot(comps, slot.id);
    }

    return slots;
  }

  private getUIPropertyData(app: BakeryApp): UIPropertyMetaData[] {
    const data: UIPropertyMetaData[] = [];
    for (const component of app.componentList) {
      const scheme = definitionIdToScheme[component.definitionId];
      if (scheme && scheme.properties) {
        data.push({ componentId: component.id, definitionId: component.definitionId, name: component.properties.name });
      }
    }
    return data;
  }
}
