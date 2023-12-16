import { Page, PageTreeNode } from '@tools-state/page/page.model';

export const PageTreeHelper = {
  buildPageTree(pageList: Page[]): PageTreeNode[] {
    const rootPages: PageTreeNode[] = [];
    const allPages = pageList.reduce((all: { [key in string]: PageTreeNode }, page: Page) => {
      all[page.id] = this.pageToPageTree(page);
      return all;
    }, {});
    for (const pageId of Object.keys(allPages)) {
      const page: PageTreeNode = allPages[pageId];
      if (!page.parentPageId) {
        rootPages.push(page);
      } else {
        allPages[page.parentPageId].children.push(page);
      }
    }
    return rootPages;
  },

  flatPageTree(root: PageTreeNode): Page[] {
    const flatted: Page[] = [this.pageTreeToPage(root)];
    const itemsToFlat = [...root.children];
    for (const treeItem of itemsToFlat) {
      itemsToFlat.push(...treeItem.children);
      flatted.push(this.pageTreeToPage(treeItem));
    }
    return flatted;
  },

  flatPageTreeList(roots: PageTreeNode[]): Page[] {
    return roots.reduce((pages: Page[], root: PageTreeNode) => {
      pages.push(...this.flatPageTree(root));
      return pages;
    }, []);
  },

  findPageTreeNode(roots: PageTreeNode[], pageId: string): PageTreeNode {
    const pagesToCheck = [...roots];
    for (const page of pagesToCheck) {
      if (page.id === pageId) {
        return page;
      }
      pagesToCheck.push(...page.children);
    }
  },

  pageToPageTree(page: Page): PageTreeNode {
    return {
      ...page,
      children: []
    };
  },

  pageTreeToPage(treeItem: PageTreeNode): Page {
    const { children, ...page } = treeItem;
    return page;
  }
};
