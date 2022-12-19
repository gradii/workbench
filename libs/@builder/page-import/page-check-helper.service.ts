import { Injectable } from '@angular/core';
import { PuffApp } from '@tools-state/app/app.model';
import { PageTreeWithProject } from '@tools-state/page/page-import.service';
import { PageTreeNode } from '@tools-state/page/page.model';
import { ProjectDto } from '@shared/project.service';

export interface CheckableProject {
  name: string;
  checked: boolean;
  indeterminate: boolean;
  pageList: CheckablePage[];
  original: PuffApp;
}

export interface CheckablePage {
  name: string;
  checked: boolean;
  pageList: CheckablePage[];
  original: PageTreeNode;
}

@Injectable()
export class PageCheckHelperService {
  convertProjects(projects: ProjectDto[]): CheckableProject[] {
    return projects.map((project: ProjectDto) => ({
      name: project.name,
      indeterminate: false,
      checked: false,
      original: project.app,
      pageList: this.convertPages(project.app.rootPageList)
    }));
  }

  // count how many pages checked in all projects
  countCheckedPages(projects: CheckableProject[]): number {
    let count = 0;
    for (const project of projects) {
      for (const page of project.pageList) {
        count += this.countChildPageChecked(page);
      }
    }
    return count;
  }

  checkPage(page: CheckablePage, checked: boolean, project: CheckableProject) {
    page.checked = checked;
    page.pageList = this.markAllChildren(page.pageList, checked);
    const projectState: -1 | 0 | 1 = this.isWholeProjectChecked(project);
    project.checked = projectState >= 0;
    project.indeterminate = projectState === 0;
  }

  checkProject(project: CheckableProject, checked: boolean) {
    project.checked = checked;
    project.indeterminate = false;
    project.pageList = this.markAllChildren(project.pageList, checked);
  }

  computeImportPages(projects: CheckableProject[]): PageTreeWithProject[] {
    const pagesToImport: PageTreeWithProject[] = [];
    projects
      .filter((project: CheckableProject) => project.checked)
      .forEach((project: CheckableProject) => {
        project.pageList.forEach((page: CheckablePage) => {
          const children: PageTreeWithProject[] = this.computeChildPageList(
            page.pageList,
            page.checked ? page.original : null,
            project
          );
          if (page.checked) {
            page.original.children = children;
            pagesToImport.push({ ...page.original, project: project.original });
          } else if (children.length) {
            pagesToImport.push(...children);
          }
        });
      });
    return pagesToImport;
  }

  private computeChildPageList(
    children: CheckablePage[],
    parent: PageTreeNode,
    project: CheckableProject
  ): PageTreeWithProject[] {
    const newChildList: PageTreeWithProject[] = [];
    for (const child of children) {
      const newParent = child.checked ? child.original : parent;
      const grandChildren: PageTreeWithProject[] = this.computeChildPageList(child.pageList, newParent, project);
      if (child.checked) {
        child.original.parentPageId = parent && parent.id;
        child.original.children = grandChildren;
        newChildList.push({ ...child.original, project: project.original });
      } else if (grandChildren.length) {
        newChildList.push(...grandChildren);
      }
    }
    return newChildList;
  }

  // returns:
  // -1 if no one page is checked
  // 0 if at least one included
  // 1 if all pages checked
  private isWholeProjectChecked(project: CheckableProject): -1 | 0 | 1 {
    let projectState: -1 | 0 | 1 = null;
    for (const child of project.pageList) {
      const childrenResult: -1 | 0 | 1 = this.isWholePageChecked(child);
      if (projectState === null) {
        projectState = childrenResult;
      }
      if (childrenResult === 0 || projectState !== childrenResult) {
        projectState = 0;
        break;
      }
    }
    return projectState;
  }

  private isWholePageChecked(page: CheckablePage): -1 | 0 | 1 {
    const result: -1 | 0 | 1 = page.checked ? 1 : -1;
    for (const child of page.pageList) {
      const childrenResult = this.isWholePageChecked(child);
      if (childrenResult === 0 || childrenResult !== result) {
        return 0;
      }
    }
    return result;
  }

  private convertPages(pages: PageTreeNode[]) {
    return pages.map((page: PageTreeNode) => ({
      name: page.name,
      checked: false,
      original: page,
      pageList: this.convertPages(page.children)
    }));
  }

  private markAllChildren(pages: CheckablePage[], checked: boolean) {
    return pages.map(page => ({
      ...page,
      checked,
      pageList: this.markAllChildren(page.pageList, checked)
    }));
  }

  private countChildPageChecked(page: CheckablePage): number {
    let count = page.checked ? 1 : 0;
    for (const child of page.pageList) {
      count += this.countChildPageChecked(child);
    }
    return count;
  }
}
