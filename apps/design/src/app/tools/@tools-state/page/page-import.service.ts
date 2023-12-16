import { Injectable } from '@angular/core';
import { AnalyticsService } from '@common';
import { Dictionary } from '@ngrx/entity';
import { Action, select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { getActiveProjectId } from '@tools-state/project/project.selectors';
import { ComponentNameService } from '@tools-state/component/component-name.service';
import { fromTools } from '@tools-state/tools.reducer';
import { BakeryComponent } from '@tools-state/component/component.model';
import { ComponentSubEntities, getSubEntitiesByComponentIdProjector } from '@tools-state/component/component.selectors';
import { PageDuplicateData, PageDuplicateService } from '@tools-state/page/page-duplicate.service';
import { Slot } from '@tools-state/slot/slot.model';
import { BakeryApp } from '@tools-state/app/app.model';
import { PageTreeHelper } from '@tools-state/page/page-tree.helper';
import { Page, PageTreeNode } from '@tools-state/page/page.model';

import { ProjectDto, ProjectService } from '@shared/project.service';

export interface PageTreeWithProject extends PageTreeNode {
  project?: BakeryApp;
}

export interface PageWithProject extends Page {
  project: BakeryApp;
}

@Injectable({ providedIn: 'root' })
export class PageImportService {
  constructor(
    private store: Store<fromTools.State>,
    private projectService: ProjectService,
    private componentContainerService: ComponentNameService,
    private analytics: AnalyticsService,
    private pageDuplicateService: PageDuplicateService
  ) {
  }

  loadAllProjects(): Observable<ProjectDto[]> {
    return combineLatest([
      this.projectService.getAllProjects(),
      this.store.pipe(select(getActiveProjectId), take(1))
    ]).pipe(
      map(([allProjects, currentProjectId]: [ProjectDto[], string]) => {
        return allProjects.filter((p: ProjectDto) => p.id !== currentProjectId);
      })
    );
  }

  import(pageTreeList: PageTreeWithProject[]) {
    const flatPages: Page[] = PageTreeHelper.flatPageTreeList(pageTreeList);
    const pageDuplicateDataList: PageDuplicateData[] = flatPages.map((page: Page) =>
      this.collectPageData(page as PageWithProject)
    );
    this.analytics.logImportPages(pageDuplicateDataList.length);
    this.pageDuplicateService.duplicatePageList(pageDuplicateDataList).subscribe((actions: Action[]) => {
      actions.forEach((action: Action) => this.store.dispatch(action));
    });
  }

  private collectPageData(pageWithProject: PageWithProject): PageDuplicateData {
    const app: BakeryApp = pageWithProject.project;
    const rootSlot: Slot = app.slotList.find((slot: Slot) => slot.parentPageId === pageWithProject.id);
    const rootComponents: BakeryComponent[] = app.componentList.filter(
      (component: BakeryComponent) => component.parentSlotId === rootSlot.id
    );
    const componentMap: Dictionary<BakeryComponent> = this.buildComponentMap(app.componentList);
    const subEntities: ComponentSubEntities[] = rootComponents.map((c: BakeryComponent) =>
      getSubEntitiesByComponentIdProjector(app.componentList, componentMap, app.slotList, c.id)
    );
    const { project, ...page } = pageWithProject;
    return { page, rootSlot, rootComponents, subEntities };
  }

  private buildComponentMap(list: BakeryComponent[]): Dictionary<BakeryComponent> {
    const dict = {};
    for (const c of list) {
      dict[c.id] = c;
    }
    return dict;
  }
}
