import { StoreItem, Theme, Workflow } from '@common';
import { NbMenuItem } from '@nebular/theme';
import { createSelectorFactory, defaultMemoize, createSelector } from '@ngrx/store';

import { BakeryComponent } from '@tools-state/component/component.model';
import { getComponentList } from '@tools-state/component/component.selectors';
import { getStoreItemListWithoutState } from '@tools-state/data/store-item/store-item.selectors';
import { getWorkflowList } from '@tools-state/data/workflow/workflow.selectors';
import { BakeryLayout } from '@tools-state/layout/layout.model';
import { getLayout } from '@tools-state/layout/layout.selectors';
import { PageTreeNode } from '@tools-state/page/page.model';
import { fromPages } from '@tools-state/page/page.reducer';
import { getPagesState, getPageTree } from '@tools-state/page/page.selectors';
import { getSlotList } from '@tools-state/slot/slot.selectors';
import { Slot } from '@tools-state/slot/slot.model';
import { BakeryApp } from '@tools-state/app/app.model';
import { getActiveTheme } from '@tools-state/theme/theme.selectors';
import { getToolsState } from '../tools.selector';
import { fromTools } from '../tools.reducer';
import { fromApp } from './app.reducer';

export const getAppStateSlice = createSelector(getToolsState, (state: fromTools.State) => state.app);

export const getInitialAppState = createSelector(getAppStateSlice, (state: fromApp.State) => state.initialApp);

// use createSelectorFactory because createSelector accept 9 arguments maximum
export const getAppState = createSelectorFactory(defaultMemoize)(
  getPagesState,
  getPageTree,
  getComponentList,
  getSlotList,
  getLayout,
  getWorkflowList,
  getStoreItemListWithoutState,
  getActiveTheme,
  getInitialAppState,
  appStateProjector
);

function appStateProjector(
  pageState: fromPages.State,
  rootPageList: PageTreeNode[],
  componentList: BakeryComponent[],
  slotList: Slot[],
  layout: BakeryLayout,
  workflowList: Workflow[],
  storeItemList: StoreItem[],
  theme: Theme,
  initialApp: BakeryApp
): BakeryApp {
  componentList = updateComplexBindings(componentList, rootPageList);

  return {
    rootPageList,
    componentList,
    slotList,
    layout,
    workflowList,
    storeItemList,
    theme,
    favicon: initialApp.favicon,
    code: initialApp.code
  };
}

// sync links and page urls
// calculate menu items (depends from pageList)
function updateComplexBindings(componentList: BakeryComponent[], rootPageList: PageTreeNode[]): BakeryComponent[] {
  return componentList.map((component: BakeryComponent) => {
    if (component.definitionId === 'menu') {
      return updateMenu(component, rootPageList);
    }
    return component;
  });
}

function updateMenu(menu: BakeryComponent, pageTree: PageTreeNode[]): BakeryComponent {
  return {
    ...menu,
    properties: {
      ...menu.properties,
      items: convertPageTreeToMenu(pageTree, '')
    }
  };
}

function convertPageTreeToMenu(pageTree: PageTreeNode[], parentUrl: string): NbMenuItem[] {
  const items: NbMenuItem[] = [];
  for (const page of pageTree) {
    const url = `${parentUrl}/${page.url}`;
    const item: NbMenuItem = {
      title: page.name,
      link: url
    };
    const children = convertPageTreeToMenu(page.children, url);
    item.children = children.length ? children : null;
    items.push(item);
  }
  return items;
}
