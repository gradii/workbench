import { select } from '@ngneat/elf';
import { selectAll, selectEntity } from '@ngneat/elf-entities';
import { PuffComponent } from '@tools-state/component/component.model';
import { getComponentList } from '@tools-state/component/component.selectors';
import { PageTreeHelper } from '@tools-state/page/page-tree.helper';
import { Page, PageTreeNode } from '@tools-state/page/page.model';
import { fromPages } from '@tools-state/page/page.reducer';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { getSlotList } from '@tools-state/slot/slot.selectors';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export const getPagesState = fromPages.fromPagesStore;

export const getPageList = getPagesState.pipe(selectAll());

export const getPageTree = getPageList.pipe(select((pageList: Page[]) => PageTreeHelper.buildPageTree(pageList)));

export const getActivePage = getPagesState.pipe(select((state: fromPages.State) => state.entities[state.activePageId]));

export const getActivePageLayout = getPagesState.pipe(
  select((state: fromPages.State) => state.entities[state.activePageId].layout)
);

export const getActivePageId = getActivePage.pipe(select((activePage: Page) => activePage && activePage.id));

export const getPageFilter = getPagesState.pipe(select((state: fromPages.State) => state.pageFilter));

export const getActivePageName = getActivePage.pipe(select((page: Page) => page.name));

export const getPageById = (id) => getPagesState.pipe(selectEntity(id));

export const getActivePageFullUrl = getPagesState.pipe(select(
  ({ entities, activePageId, setFromKitchen }: fromPages.State) => {
    if (!activePageId || setFromKitchen) {
      return;
    }
    return findPageFullUrl(entities, activePageId);
  }
));

export const getRootSpaceForActivePage = combineLatest(
  [
    getPageList,
    getSlotList,
    getComponentList,
    getActivePageId
  ]).pipe(
  map(([
         pageList,
         slotList,
         componentList,
         activePageId
       ]: [Page[], PuffSlot[], PuffComponent[], string]) => {
    return getRootSpaceForPageProjector(pageList, slotList, componentList, activePageId);
  })
);

export const getRootSpaceForPage = (pageId: string) => combineLatest(
  [
    getPageList,
    getSlotList,
    getComponentList
  ]).pipe(
  map((
    [pageList, slotList, componentList]: [Page[], PuffSlot[], PuffComponent[]]
  ) => {
    return getRootSpaceForPageProjector(pageList, slotList, componentList, pageId);
  })
);

function getRootSpaceForPageProjector(
  pageList: Page[],
  slotList: PuffSlot[],
  componentList: PuffComponent[],
  pageId: string
) {
  const rootSlot: PuffSlot = slotList.find((slot: PuffSlot) => slot.parentPageId === pageId);
  if (rootSlot) {
    return componentList.find((c: PuffComponent) => c.index === 0 && c.parentSlotId === rootSlot.id);
  }
  throw new Error('Root slot not found');
}

// parent page can't be itself or page that is child page
export const getAvailableParentPageList = combineLatest(
  [
    getPageList,
    getPageTree,
    getActivePage
  ]).pipe(
  map(([pageList, rootPages, activePage]: [Page[], PageTreeNode[], Page]) => {
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
  ));

// active page can't be deleted if it is the last root page in tree
export const canRemovePages = combineLatest(
  [
    getPageTree,
    getActivePage
  ]).pipe(
  map(([rootPages, activePage]: [PageTreeNode[], Page]) => {
    if (!activePage) {
      return false;
    }
    return !(rootPages.length === 1 && rootPages[0].id === activePage.id);
  })
);

export const getSubPagesIds = pageId => getPageTree.pipe(map((rootPages: PageTreeNode[]) => {
  const pageLeaf: PageTreeNode = PageTreeHelper.findPageTreeNode(rootPages, pageId);
  const pagesToDelete          = pageLeaf ? PageTreeHelper.flatPageTree(pageLeaf) : [];
  return pagesToDelete.map(page => page.id);
}));

export const getFilteredPageTree = combineLatest(
  [
    getPageTree,
    getPageFilter
  ]).pipe(
  map(([rootPages, filter]: [PageTreeNode[], string]) => {
    return rootPages.map((page: PageTreeNode) => filterPageNode(page, filter)).filter((page: PageTreeNode) => !!page);
  })
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
    url  = `${page.url}/${url}`;
  }
  return url;
}
