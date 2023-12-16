import { createSelector } from '@ngrx/store';

import { PageTreeHelper } from '@tools-state/page/page-tree.helper';
import { Page, PageTreeNode } from '@tools-state/page/page.model';
import { fromPages } from '@tools-state/page/page.reducer';
import { getSlotList } from '@tools-state/slot/slot.selectors';
import { getComponentList } from '@tools-state/component/component.selectors';
import { Slot } from '@tools-state/slot/slot.model';
import { BakeryComponent } from '@tools-state/component/component.model';
import { fromTools } from '@tools-state/tools.reducer';
import { getToolsState } from '@tools-state/tools.selector';

export const getPagesState = createSelector(getToolsState, (state: fromTools.State) => state.pages);

export const getPageList = createSelector(getPagesState, fromPages.selectAll);

export const getPageTree = createSelector(getPageList, (pageList: Page[]) => PageTreeHelper.buildPageTree(pageList));

export const getActivePage = createSelector(
  getPagesState,
  (state: fromPages.State) => state.entities[state.activePageId]
);

export const getActivePageLayout = createSelector(
  getPagesState,
  (state: fromPages.State) => state.entities[state.activePageId].layout
);

export const getActivePageId = createSelector(getActivePage, (activePage: Page) => activePage && activePage.id);

export const getPageFilter = createSelector(getPagesState, (state: fromPages.State) => state.pageFilter);

export const getActivePageName = createSelector(getActivePage, (page: Page) => page.name);

export const getPageById = createSelector(getPagesState, (state: fromPages.State, id: string) => state.entities[id]);

export const getActivePageFullUrl = createSelector(
  getPagesState,
  ({ entities, activePageId, setFromOven }: fromPages.State) => {
    if (!activePageId || setFromOven) {
      return;
    }
    return findPageFullUrl(entities, activePageId);
  }
);

export const getRootSpaceForActivePage = createSelector(
  getPageList,
  getSlotList,
  getComponentList,
  getActivePageId,
  (pageList: Page[], slotList: Slot[], componentList: BakeryComponent[], activePageId: string) => {
    return getRootSpaceForPageProjector(pageList, slotList, componentList, activePageId);
  }
);

export const getRootSpaceForPage = createSelector(
  getPageList,
  getSlotList,
  getComponentList,
  (pageList: Page[], slotList: Slot[], componentList: BakeryComponent[], pageId: string) => {
    return getRootSpaceForPageProjector(pageList, slotList, componentList, pageId);
  }
);

function getRootSpaceForPageProjector(
  pageList: Page[],
  slotList: Slot[],
  componentList: BakeryComponent[],
  pageId: string
) {
  const rootSlot: Slot = slotList.find((slot: Slot) => slot.parentPageId === pageId);
  if (rootSlot) {
    return componentList.find((c: BakeryComponent) => c.index === 0 && c.parentSlotId === rootSlot.id);
  }
}

// parent page can't be itself or page that is child page
export const getAvailableParentPageList = createSelector(
  getPageList,
  getPageTree,
  getActivePage,
  (pageList: Page[], rootPages: PageTreeNode[], activePage: Page) => {
    if (!activePage) {
      return pageList;
    }
    const activePageTree = PageTreeHelper.findPageTreeNode(rootPages, activePage.id);
    return pageList.filter((page: Page) => {
      if (page.id === activePage.id) {
        return false;
      }
      return !PageTreeHelper.findPageTreeNode([activePageTree], page.id);
    });
  }
);

// active page can't be deleted if it is the last root page in tree
export const canRemovePages = createSelector(
  getPageTree,
  getActivePage,
  (rootPages: PageTreeNode[], activePage: Page) => {
    if (!activePage) {
      return false;
    }
    return !(rootPages.length === 1 && rootPages[0].id === activePage.id);
  }
);

export const getSubPagesIds = createSelector(getPageTree, (rootPages: PageTreeNode[], pageId: string) => {
  const pageLeaf: PageTreeNode = PageTreeHelper.findPageTreeNode(rootPages, pageId);
  const pagesToDelete = pageLeaf ? PageTreeHelper.flatPageTree(pageLeaf) : [];
  return pagesToDelete.map(page => page.id);
});

export const getFilteredPageTree = createSelector(
  getPageTree,
  getPageFilter,
  (rootPages: PageTreeNode[], filter: string) => {
    return rootPages.map((page: PageTreeNode) => filterPageNode(page, filter)).filter((page: PageTreeNode) => !!page);
  }
);

function filterPageNode(pageNode: PageTreeNode, filterString: string): PageTreeNode {
  const newChildren = [];
  for (const child of pageNode.children) {
    const filteredChild = filterPageNode(child, filterString);
    if (filteredChild) {
      newChildren.push(filteredChild);
    }
  }

  if (newChildren.length) {
    pageNode = { ...pageNode, children: newChildren };
  } else if (filterByName(pageNode.name, filterString)) {
    pageNode = { ...pageNode, children: [] };
  } else {
    pageNode = null;
  }

  return pageNode;
}

function filterByName(name: string, filterString: string): boolean {
  return name.toLocaleLowerCase().trim().includes(filterString.toLocaleLowerCase().trim());
}

export function findPageFullUrl(entities, pageId: string) {
  let page = entities[pageId];
  // Check on empty page when page is deleted
  // but `link` or `button link` has path to this page
  if (!page) {
    return '';
  }
  let url = page.url;
  while (page.parentPageId) {
    page = entities[page.parentPageId];
    url = `${page.url}/${url}`;
  }
  return url;
}
