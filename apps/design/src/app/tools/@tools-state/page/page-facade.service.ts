import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { AclService, AnalyticsService, BreakpointWidth, combineWith, nextPageId, SpaceHeightType } from '@common';

import { HistoryActions } from '@tools-state/history/history.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { PageActions } from '@tools-state/page/page.actions';
import { Page, PageTreeNode, PageUpdate } from '@tools-state/page/page.model';
import { ComponentActions } from '@tools-state/component/component.actions';
import { BakeryComponent } from '@tools-state/component/component.model';
import { getRootComponentIdAndSlotIdLists, getSubComponentIds } from '@tools-state/component/component.selectors';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { Slot } from '@tools-state/slot/slot.model';
import {
  canRemovePages,
  getActivePage,
  getAvailableParentPageList,
  getFilteredPageTree,
  getPageById,
  getPageFilter,
  getPageList,
  getRootSpaceForPage,
  getSubPagesIds
} from '@tools-state/page/page.selectors';
import { PageDuplicateService } from '@tools-state/page/page-duplicate.service';
import { InstanceCreationHelper } from '@tools-state/util/instance-creation.helper';
import { fromTools } from '@tools-state/tools.reducer';
import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { VariableRenameService } from '@tools-state/data/variable-rename.service';

@Injectable({ providedIn: 'root' })
export class PageFacade {
  readonly pageList$: Observable<Page[]> = this.store.pipe(select(getPageList));
  readonly activePage$: Observable<Page> = this.store.pipe(select(getActivePage));
  readonly filteredPageTree$: Observable<PageTreeNode[]> = this.store.pipe(select(getFilteredPageTree));
  readonly availablePageParentList$: Observable<Page[]> = this.store.pipe(select(getAvailableParentPageList));
  readonly canRemovePages$: Observable<boolean> = this.store.pipe(select(canRemovePages));
  readonly pageFilter$: Observable<string> = this.store.pipe(select(getPageFilter));
  readonly canCreatePage$: Observable<boolean> = this.acl.canCreatePage();
  readonly pageImportAvailable$: Observable<boolean> = this.acl.hasPageImport();

  constructor(
    private store: Store<fromTools.State>,
    private acl: AclService,
    private stateHelper: InstanceCreationHelper,
    private pageDuplicateService: PageDuplicateService,
    private projectFacade: ProjectFacade,
    private variableRenameService: VariableRenameService,
    private analyticsService: AnalyticsService
  ) {
  }

  addPage(pageData: Partial<Page>) {
    const page = {
      id: nextPageId(),
      name: pageData.name,
      url: pageData.url,
      parentPageId: pageData.parentPageId
    };
    const pageSlot: Slot = this.stateHelper.createPageSlot(page.id);
    const defaultSpaceStyle = {
      [BreakpointWidth.Desktop]: {
        height: {
          type: SpaceHeightType.CUSTOM,
          customValue: 100,
          customUnit: '%'
        }
      }
    };
    this.stateHelper
      .createSpace(pageSlot.id, defaultSpaceStyle)
      .pipe(withLatestFrom(this.projectFacade.activeProjectName$))
      .subscribe(([space, projectName]: [BakeryComponent, string]) => {
        const spaceSlot: Slot = this.stateHelper.createComponentSlot(space.id);
        this.store.dispatch(new PageActions.AddPage(page));
        this.store.dispatch(new SlotActions.AddSlot(pageSlot));
        this.store.dispatch(new SlotActions.AddSlot(spaceSlot));
        this.store.dispatch(new ComponentActions.AddComponent(space));
        this.store.dispatch(new ComponentActions.SelectComponent([space.id]));
        this.store.dispatch(new PageActions.SetActivePage(page.id, false));
        this.store.dispatch(new WorkingAreaActions.SyncState());
        this.store.dispatch(new ProjectActions.UpdateProject());
        this.store.dispatch(new HistoryActions.Persist());

        this.analyticsService.logAddPage(page.name, projectName);
      });
  }

  removePage(id: string) {
    this.store
      .pipe(select(getSubPagesIds, id))
      .pipe(
        take(1),
        switchMap((pageIdList: string[]) => this.getChildrenIdList(pageIdList)),
        withLatestFrom(this.store.pipe(select(getPageList)), this.projectFacade.activeProjectName$),
        map(([[pageIdList, componentIdList, slotIdList], allPages, projectName]: [string[][], Page[], string]) => {
          const currentPage = allPages.find(page => page.id === id);
          this.analyticsService.logDeletePage(currentPage.name, projectName);

          const newActivePage: Page = allPages.find(page => !pageIdList.includes(page.id));
          return [newActivePage, pageIdList, componentIdList, slotIdList];
        }),
        combineWith(
          ([newActivePage, pageIdList, componentIdList, slotIdList]: [Page, string[], string[], string[]]) => {
            return this.store.pipe(select(getRootSpaceForPage, newActivePage.id));
          }
        )
      )
      .subscribe(
        ([[activePage, pageIdList, componentIdList, slotIdList], space]: [
          [Page, string[], string[], string[]],
          BakeryComponent,
        ]) => {
          // When user deletes any page we set active page to be first page
          this.store.dispatch(new ComponentActions.RemoveComponentList(componentIdList));
          this.store.dispatch(new SlotActions.RemoveSlotList(slotIdList));
          this.store.dispatch(new PageActions.SetActivePage(activePage.id, false));
          this.store.dispatch(new ComponentActions.SelectComponent([space.id]));
          this.store.dispatch(new PageActions.RemovePageList(pageIdList));
          this.store.dispatch(new WorkingAreaActions.SyncState());
          this.store.dispatch(new ProjectActions.UpdateProject());
          this.store.dispatch(new HistoryActions.Persist());
        }
      );
  }

  duplicate(id: string) {
    this.pageDuplicateService
      .duplicate(id)
      .pipe(
        switchMap(actions => {
          return combineLatest([this.store.select(getPageById, id), this.projectFacade.activeProjectName$]).pipe(
            take(1),
            map(([page, projectName]) => {
              this.analyticsService.logCopyPage(page.name, projectName);
              return actions;
            })
          );
        })
      )
      .subscribe((actions: Action[]) => {
        actions.forEach((action: Action) => this.store.dispatch(action));
      });
  }

  setActivePageAndSync(id: string): void {
    this.setActivePage(id, false).subscribe(() => {
      this.store.dispatch(new WorkingAreaActions.SyncState());
      this.store.dispatch(new HistoryActions.Persist());
    });
  }

  updatePage(page: PageUpdate) {
    this.variableRenameService.getRenameActionsIfNeededForRoutes(page).subscribe(renameAction => {
      const actionsToExecute = [
        ...renameAction,
        new PageActions.UpdatePage(page),
        new WorkingAreaActions.SyncState(),
        new ProjectActions.UpdateProject(),
        new HistoryActions.Persist()
      ];
      actionsToExecute.forEach((action: Action) => this.store.dispatch(action));
    });
  }

  updateFilter(filter: string) {
    this.store.dispatch(new PageActions.SetPageFilter(filter));
  }

  setActivePage(id: string, setFromOven: boolean): Observable<BakeryComponent> {
    return this.store.pipe(
      select(getRootSpaceForPage, id),
      take(1),
      tap((rootSpace: BakeryComponent) => {
        this.store.dispatch(new ComponentActions.SelectComponent([rootSpace.id]));
        this.store.dispatch(new PageActions.SetActivePage(id, setFromOven));
      })
    );
  }

  // TODO to much take(1)
  private getChildrenIdList(pageIdList: string[]): Observable<string[][]> {
    return this.store.select(getRootComponentIdAndSlotIdLists, pageIdList).pipe(
      take(1),
      switchMap(componentAndSlotIdLists => this.store.select(getSubComponentIds, componentAndSlotIdLists)),
      take(1),
      map(({ componentIdList, slotIdList }) => [pageIdList, componentIdList, slotIdList])
    );
  }
}
