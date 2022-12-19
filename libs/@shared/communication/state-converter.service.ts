import { Injectable } from '@angular/core';
import {
  definitionIdToScheme, KitchenApp, KitchenComponent, KitchenContentSlot, KitchenFeature, KitchenHeader, KitchenPage,
  KitchenSidebar, KitchenSlot, KitchenType, UIPropertyMetaData
} from '@common/public-api';

import { PuffApp } from '@tools-state/app/app.model';
import type { PuffComponent } from '@tools-state/component/component.model';
import { PuffFeature } from '@tools-state/feature/feature.model';
import { Page, PageTreeNode } from '@tools-state/page/page.model';
import { PuffSlot } from '@tools-state/slot/slot.model';

@Injectable({ providedIn: 'root' })
export class StateConverterService {
  // TODO performance hotfix, refactor communication when it'll be possible
  convertActivePageState(app: PuffApp, activePage: Page): KitchenApp {
    if (!activePage) {
      return null;
    }

    return {
      routes           : this.createRoutes(app.rootPageList),
      pageList         : this.createPage(app, activePage),
      header           : this.buildLayoutPart(app.componentList, app.featureList, app.slotList, 'headerSlot'),
      sidebar          : this.buildLayoutPart(app.componentList, app.featureList, app.slotList, 'sidebarSlot'),
      layout           : app.layout,
      theme            : app.theme,
      actionDiagramList: app.actionDiagramList,
      actionFlowList   : app.actionFlowList,
      workflowList     : app.workflowList,
      storeItemList    : app.storeItemList,
      favicon          : app.favicon,
      code             : app.code,
      uiPropertyData   : this.getUIPropertyData(app)
    };
  }

  private createPage(app: PuffApp, page: Page): KitchenPage[] {
    const kitchenPage: KitchenPage = {
      id      : page.id,
      title   : page.name,
      url     : page.url,
      layout  : page.layout,
      pageList: [],
      slots   : this.getPageSlots(page as PageTreeNode, app.componentList, app.featureList, app.slotList)
    };

    return [kitchenPage];
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

  convertState(app: PuffApp): KitchenApp {
    return {
      pageList         : this.convertPageList(app.rootPageList, app.componentList, app.featureList, app.slotList),
      header           : this.buildLayoutPart(app.componentList, app.featureList, app.slotList, 'headerSlot'),
      sidebar          : this.buildLayoutPart(app.componentList, app.featureList, app.slotList, 'sidebarSlot'),
      layout           : app.layout,
      theme            : app.theme,
      actionDiagramList: app.actionDiagramList,
      actionFlowList   : app.actionFlowList,
      workflowList     : app.workflowList,
      storeItemList    : app.storeItemList,
      favicon          : app.favicon,
      code             : app.code,
      uiPropertyData   : this.getUIPropertyData(app)
    };
  }

  convertKitchenComponent(component: KitchenComponent): PuffComponent {
    return {
      id          : component.id,
      type        : KitchenType.Component,
      definitionId: component.definitionId,
      styles      : component.styles,
      properties  : component.properties,
      index       : component.index,
      actions     : component.actions,
      parentSlotId: ''
    };
  }

  /**
   * Iterates over component sub entities and generate all slots and components.
   * */
  getSubEntities(component: KitchenComponent): {
    slots: PuffSlot[];
    components: PuffComponent[];
    features: PuffFeature[]
  } {
    const subEntities = { slots: [], features: [], components: [] };

    const componentListToExtractChildren: KitchenComponent[] = [component];
    for (const parent of componentListToExtractChildren) {
      if (!parent.slots) {
        continue;
      }

      for (const [slotName, slot] of Object.entries(parent.slots)) {
        subEntities.slots.push({
          id               : slot.id,
          name             : slotName,
          parentComponentId: parent.id
        });

        for (const child of slot.componentList) {
          const cmpToPush: PuffComponent = {
            id          : child.id,
            type        : KitchenType.Component,
            definitionId: child.definitionId,
            styles      : child.styles,
            properties  : child.properties,
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
    componentList: PuffComponent[],
    featureList: PuffFeature[],
    slotList: PuffSlot[]
  ): KitchenPage[] {
    return rootPageList.map((page: PageTreeNode) => ({
      id      : page.id,
      title   : page.name,
      url     : page.url,
      layout  : page.layout,
      pageList: this.convertPageList(page.children, componentList, featureList, slotList),
      slots   : this.getPageSlots(page, componentList, featureList, slotList)
    }));
  }

  private buildLayoutPart(
    componentList: PuffComponent[],
    featureList: PuffFeature[],
    slotList: PuffSlot[],
    layoutSlotName: string
  ): KitchenHeader | KitchenSidebar {
    const layoutSlot     = slotList.find((slot: PuffSlot) => slot[layoutSlotName]);
    const slotComponents = this.getSlotComponentList(layoutSlot.id, componentList as PuffComponent[],
      featureList as PuffFeature[], slotList);
    const slotDirectives = this.getSlotFeatureList(layoutSlot.id, componentList as PuffComponent[],
      featureList as PuffFeature[], slotList);
    return {
      slots: {
        content: new KitchenSlot(slotComponents, layoutSlot.id, slotDirectives)
      }
    };
  }

  private getPageSlots(page: PageTreeNode,
                       componentList: PuffComponent[],
                       featureList: PuffFeature[],
                       slotList: PuffSlot[]): { content: KitchenSlot } {
    const slotData: PuffSlot = slotList.find((slot: PuffSlot) => slot.parentPageId === page.id);
    const slotComponents     = this.getSlotComponentList(
      slotData.id,
      componentList as PuffComponent[],
      featureList as PuffFeature[],
      slotList
    );
    const slotFeatures       = this.getSlotFeatureList(
      slotData.id,
      componentList as PuffComponent[],
      featureList as PuffFeature[],
      slotList
    );

    return { content: new KitchenSlot(slotComponents, slotData.id, slotFeatures) };
  }

  private getComponentFeatureList(componentId: string,
                                  componentList: PuffFeature[],
                                  slotList: PuffSlot[]
  ): KitchenFeature[] {
    return componentList
      .filter((component: PuffFeature) => component.hostId === componentId)
      .map(component => this.convertFeature(component, componentList, slotList));
  }


  private getSlotFeatureList(slotId: string,
                             componentList: PuffComponent[],
                             featureList: PuffFeature[],
                             slotList: PuffSlot[]
  ): KitchenFeature[] {
    return featureList
      .filter((component: PuffFeature) => component.hostId === slotId)
      .map(component => this.convertFeature(component, featureList, slotList));
  }

  private getSlotComponentList(slotId: string,
                               componentList: PuffComponent[],
                               featureList: PuffFeature[],
                               slotList: PuffSlot[]
  ): KitchenComponent[] {
    return componentList
      .filter((component: PuffComponent) => component.parentSlotId === slotId)
      .map((component: PuffComponent) => this.convertComponent(
        component,
        componentList,
        featureList,
        slotList
      ))
      .sort((a, b) => a.index - b.index);
  }

  private convertFeature(
    component: PuffFeature,
    componentList: PuffFeature[],
    slotList: PuffSlot[]
  ): KitchenFeature {
    return {
      id          : component.id,
      type        : KitchenType.Feature,
      definitionId: component.definitionId,
      hostId      : component.hostId,
      styles      : component.styles,
      properties  : component.properties,
      actions     : component.actions,
      index       : component.index
    };
  }

  private convertComponent(
    component: PuffComponent,
    componentList: PuffComponent[],
    featureList: PuffFeature[],
    slotList: PuffSlot[]
  ): KitchenComponent {
    const [contentSlot, slots] = this.getComponentSlots(component, componentList, featureList, slotList);

    return {
      id          : component.id,
      type        : KitchenType.Component,
      definitionId: component.definitionId,
      parentSlotId: component.parentSlotId,
      styles      : component.styles,
      properties  : component.properties,
      actions     : component.actions,
      contentSlot : contentSlot,
      slots       : slots,
      featureList : this.getComponentFeatureList(component.id, featureList, slotList),
      index       : component.index
    };
  }

  private getComponentSlots(
    component: PuffComponent,
    componentList: PuffComponent[],
    featureList: PuffFeature[],
    slotList: PuffSlot[]
  ): [KitchenContentSlot, { [key: string]: KitchenSlot }] {
    const slots  = {};
    const slotsL = slotList.filter((slot: PuffSlot) => slot.parentComponentId === component.id);

    let contentSlot;
    for (const slot of slotsL) {
      const comps = this.getSlotComponentList(slot.id, componentList, featureList, slotList);
      const dirs  = this.getSlotFeatureList(slot.id, componentList, featureList, slotList);
      if (slot.name === 'content') {
        contentSlot = new KitchenContentSlot(comps, slot.id);
      } else {
        slots[slot.name] = new KitchenSlot(comps, slot.id, dirs);
      }
    }

    return [contentSlot, slots];
  }

  private getUIPropertyData(app: PuffApp): UIPropertyMetaData[] {
    const data: UIPropertyMetaData[] = [];
    for (const component of app.componentList) {
      const scheme = definitionIdToScheme[component.definitionId];
      if (scheme && scheme.properties) {
        data.push({
          componentId : component.id,
          definitionId: component.definitionId,
          name        : component.properties.name
        });
      }
    }
    return data;
  }
}
