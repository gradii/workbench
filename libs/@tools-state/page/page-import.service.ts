import { Injectable } from '@angular/core';
import { AnalyticsService } from '@common/public-api';
import { dispatch } from '@ngneat/effects';
import { Action } from '@ngneat/effects/lib/actions.types';

import { ProjectDto, ProjectService } from '@shared/project.service';
import { PuffApp } from '@tools-state/app/app.model';
import { PuffComponentOrDirective } from '@tools-state/common.model';
import { ComponentNameService } from '@tools-state/component/component-name.service';
import { PuffComponent } from '@tools-state/component/component.model';
import { ComponentSubEntities, getSubEntitiesByComponentIdProjector } from '@tools-state/component/component.selectors';
import { PageDuplicateData, PageDuplicateService } from '@tools-state/page/page-duplicate.service';
import { PageTreeHelper } from '@tools-state/page/page-tree.helper';
import { Page, PageTreeNode } from '@tools-state/page/page.model';

import { getActiveProjectId } from '@tools-state/project/project.selectors';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export interface PageTreeWithProject extends PageTreeNode {
  project?: PuffApp;
}

export interface PageWithProject extends Page {
  project: PuffApp;
}

@Injectable({ providedIn: 'root' })
export class PageImportService {
  constructor(
    private projectService: ProjectService,
    private componentContainerService: ComponentNameService,
    private analytics: AnalyticsService,
    private pageDuplicateService: PageDuplicateService
  ) {
  }

  loadAllProjects(): Observable<ProjectDto[]> {
    return combineLatest([
      this.projectService.getAllProjects(),
      getActiveProjectId.pipe(take(1))
    ]).pipe(
      map(([allProjects, currentProjectId]: [ProjectDto[], string]) => {
        return allProjects.filter((p: ProjectDto) => p.viewId !== currentProjectId);
      })
    );
  }

  import(pageTreeList: PageTreeWithProject[]) {
    const flatPages: Page[]                          = PageTreeHelper.flatPageTreeList(pageTreeList);
    const pageDuplicateDataList: PageDuplicateData[] = flatPages.map((page: Page) =>
      this.collectPageData(page as PageWithProject)
    );
    this.analytics.logImportPages(pageDuplicateDataList.length);
    this.pageDuplicateService.duplicatePageList(pageDuplicateDataList).subscribe((actions: Action[]) => {
      actions.forEach((action: Action) => dispatch(action));
    });
  }

  private collectPageData(pageWithProject: PageWithProject): PageDuplicateData {
    const app: PuffApp                         = pageWithProject.project;
    const rootSlot: PuffSlot                       = app.slotList.find(
      (slot: PuffSlot) => slot.parentPageId === pageWithProject.id);
    const rootComponents: PuffComponent[]      = app.componentList.filter(
      (component: PuffComponent): component is PuffComponent => component.parentSlotId === rootSlot.id
    );
    const componentMap: Partial<PuffComponent> = this.buildComponentMap(app.componentList);
    const subEntities: ComponentSubEntities[]  = rootComponents.map((c: PuffComponent) =>
      getSubEntitiesByComponentIdProjector(app.componentList, componentMap, app.featureList, app.slotList, c.id)
    );
    const { project, ...page }                 = pageWithProject;
    return { page, rootSlot, rootComponents, subEntities };
  }

  private buildComponentMap(list: PuffComponentOrDirective[]): Partial<PuffComponent> {
    const dict = {};
    for (const c of list) {
      dict[c.id] = c;
    }
    return dict;
  }
}
