import { ActionDiagram, ActionFlow, StoreItem, Theme, Workflow } from '@common/public-api';
import { select } from '@ngneat/elf';
import { PuffApp } from '@tools-state/app/app.model';

import { PuffComponent } from '@tools-state/component/component.model';
import { getComponentList } from '@tools-state/component/component.selectors';
import { getActionDiagramList } from '@tools-state/data/action-diagram/action-diagram.selectors';
import { getStoreItemListWithoutState } from '@tools-state/data/store-item/store-item.selectors';
import { getWorkflowList } from '@tools-state/data/workflow/workflow.selectors';
import { getFeatureList } from '@tools-state/feature/feature.selectors';
import { BakeryLayout } from '@tools-state/layout/layout.model';
import { getLayout } from '@tools-state/layout/layout.selectors';
import { PageTreeNode } from '@tools-state/page/page.model';
import { fromPages } from '@tools-state/page/page.reducer';
import { getPagesState, getPageTree } from '@tools-state/page/page.selectors';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { getSlotList } from '@tools-state/slot/slot.selectors';
import { getActiveTheme } from '@tools-state/theme/theme.selectors';
import { combineLatest } from 'rxjs';
import { getActionFlowList } from '../data/action-flow/action-flow.selectors';
import { PuffFeature } from '../feature/feature.model';
import { fromApp } from './app.reducer';
import appStore = fromApp.appStore;

export const getAppStateSlice = appStore;

export const getInitialAppState = getAppStateSlice.pipe(select((state: fromApp.State) => state.initialApp));

// use createSelectorFactory because createSelector accept 9 arguments maximum
export const getAppState = combineLatest(
  [
    getPagesState,
    getPageTree,
    getComponentList,
    getFeatureList,
    getSlotList,
    getLayout,
    getActionDiagramList,
    getActionFlowList,
    getWorkflowList,
    getStoreItemListWithoutState,
    getActiveTheme,
    getInitialAppState
  ]).pipe(
  select((
    [
      pageState, rootPageList, componentList, featureList, slotList, layout, actionDiagramList, actionFlowList,
      workflowList, storeItemList, theme, initialApp
    ]: [fromPages.State, PageTreeNode[], PuffComponent[], PuffFeature[], PuffSlot[], BakeryLayout, ActionDiagram[], ActionFlow[], Workflow[], StoreItem[], Theme, PuffApp]
  ) => {
    componentList = updateComplexBindings(componentList, rootPageList);

    return {
      rootPageList,
      componentList,
      featureList,
      slotList,
      layout,
      actionDiagramList,
      actionFlowList,
      workflowList,
      storeItemList,
      theme,
      favicon: initialApp.favicon,
      code   : initialApp.code
    };
  })
);

// sync links and page urls
// calculate menu items (depends from pageList)
function updateComplexBindings(componentList: PuffComponent[], rootPageList: PageTreeNode[]): PuffComponent[] {
  return componentList.map((component: PuffComponent) => {
    if (component.definitionId === 'menu') {
      return updateMenu(component, rootPageList);
    }
    return component;
  });
}

function updateMenu(menu: PuffComponent, pageTree: PageTreeNode[]): PuffComponent {
  return {
    ...menu,
    properties: {
      ...menu.properties,
      items: convertPageTreeToMenu(pageTree, '')
    }
  };
}

function convertPageTreeToMenu(pageTree: PageTreeNode[], parentUrl: string): any[] {
  const items: any[] = [];
  for (const page of pageTree) {
    const url       = `${parentUrl}/${page.url}`;
    const item: any = {
      title: page.name,
      link : url
    };
    const children  = convertPageTreeToMenu(page.children, url);
    item.children   = children.length ? children : null;
    items.push(item);
  }
  return items;
}
