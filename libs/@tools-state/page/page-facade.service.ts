import { Injectable } from '@angular/core';
import { AclService, BreakpointWidth, combineWith, nextPageId, SpaceHeightType } from '@common/public-api';
import { dispatch } from '@ngneat/effects';
import { Action } from '@ngneat/effects/lib/actions.types';
import { ComponentActions } from '@tools-state/component/component.actions';
import { PuffComponent } from '@tools-state/component/component.model';
import { getRootComponentIdAndSlotIdLists, getSubComponentIds } from '@tools-state/component/component.selectors';
import { VariableRenameService } from '@tools-state/data/variable-rename.service';

import { HistoryActions } from '@tools-state/history/history.actions';
import { PageDuplicateService } from '@tools-state/page/page-duplicate.service';
import { PageActions } from '@tools-state/page/page.actions';
import { Page, PageTreeNode, PageUpdate } from '@tools-state/page/page.model';
import {
  canRemovePages, getActivePage, getAvailableParentPageList, getFilteredPageTree, getPageById, getPageFilter,
  getPageList, getRootSpaceForPage, getSubPagesIds
} from '@tools-state/page/page.selectors';
import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { ProjectActions } from '@tools-state/project/project.actions';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { InstanceCreationHelper } from '@tools-state/util/instance-creation.helper';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PageFacade {
  readonly pageList$: Observable<Page[]>                 = getPageList;
  readonly activePage$: Observable<Page>                 = getActivePage;
  readonly filteredPageTree$: Observable<PageTreeNode[]> = getFilteredPageTree;
  readonly availablePageParentList$: Observable<Page[]>  = getAvailableParentPageList;
  readonly canRemovePages$: Observable<boolean>          = canRemovePages;
  readonly pageFilter$: Observable<string>               = getPageFilter;
  readonly canCreatePage$: Observable<boolean>           = this.acl.canCreatePage();
  readonly pageImportAvailable$: Observable<boolean>     = this.acl.hasPageImport();

  constructor(
    private acl: AclService,
    private stateHelper: InstanceCreationHelper,
    private pageDuplicateService: PageDuplicateService,
    private projectFacade: ProjectFacade,
    private variableRenameService: VariableRenameService
    // private analyticsService: AnalyticsService
  ) {
  }

  addPage(pageData: Partial<Page>) {
    const page              = {
      id          : nextPageId(),
      name        : pageData.name,
      url         : pageData.url,
      parentPageId: pageData.parentPageId
    };
    const pageSlot: PuffSlot    = this.stateHelper.createPageSlot(page.id);
    const defaultSpaceStyle = {
      [BreakpointWidth.Desktop]: {
        height: {
          type       : SpaceHeightType.CUSTOM,
          customValue: 100,
          customUnit : '%'
        }
      }
    };
    this.stateHelper
      .createSpace(pageSlot.id, defaultSpaceStyle)
      .pipe(withLatestFrom(this.projectFacade.activeProjectName$))
      .subscribe(([space, projectName]: [PuffComponent, string]) => {
        const spaceSlot: PuffSlot = this.stateHelper.createComponentSlot(space.id);
        dispatch(PageActions.AddPage(page));
        dispatch(SlotActions.AddSlot(pageSlot));
        dispatch(SlotActions.AddSlot(spaceSlot));
        dispatch(ComponentActions.AddComponent(space));
        dispatch(ComponentActions.SelectComponent([space.id]));
        dispatch(PageActions.SetActivePage(page.id, false));
        dispatch(WorkingAreaActions.SyncState());
        dispatch(ProjectActions.UpdateProject());
        dispatch(HistoryActions.Persist());

        // this.analyticsService.logAddPage(page.name, projectName);
      });
  }

  removePage(id: string) {
    getSubPagesIds(id)
      .pipe(
        take(1),
        switchMap((pageIdList: string[]) => this.getChildrenIdList(pageIdList)),
        withLatestFrom(getPageList, this.projectFacade.activeProjectName$),
        map(([[pageIdList, componentIdList, slotIdList], allPages, projectName]: [string[][], Page[], string]) => {
          const currentPage = allPages.find(page => page.id === id);
          // this.analyticsService.logDeletePage(currentPage.name, projectName);

          const newActivePage: Page = allPages.find(page => !pageIdList.includes(page.id));
          return [newActivePage, pageIdList, componentIdList, slotIdList];
        }),
        combineWith(
          ([newActivePage, pageIdList, componentIdList, slotIdList]: [Page, string[], string[], string[]]) => {
            return getRootSpaceForPage(newActivePage.id);
          }
        )
      )
      .subscribe(
        ([[activePage, pageIdList, componentIdList, slotIdList], space]: [
          [Page, string[], string[], string[]],
          PuffComponent,
        ]) => {
          // When user deletes any page we set active page to be first page
          dispatch(ComponentActions.RemoveComponentList(componentIdList));
          dispatch(SlotActions.RemoveSlotList(slotIdList));
          dispatch(PageActions.SetActivePage(activePage.id, false));
          dispatch(ComponentActions.SelectComponent([space.id]));
          dispatch(PageActions.RemovePageList(pageIdList));
          dispatch(WorkingAreaActions.SyncState());
          dispatch(ProjectActions.UpdateProject());
          dispatch(HistoryActions.Persist());
        }
      );
  }

  duplicate(id: string) {
    this.pageDuplicateService
      .duplicate(id)
      .pipe(
        switchMap(actions => {
          return combineLatest([getPageById(id), this.projectFacade.activeProjectName$]).pipe(
            take(1),
            map(([page, projectName]) => {
              // this.analyticsService.logCopyPage(page.name, projectName);
              return actions;
            })
          );
        })
      )
      .subscribe((actions: Action[]) => {
        actions.forEach((action: Action) => dispatch(action));
      });
  }

  setActivePageAndSync(id: string): void {
    this.setActivePage(id, false).subscribe(() => {
      dispatch(WorkingAreaActions.SyncState());
      dispatch(HistoryActions.Persist());
    });
  }

  updatePage(page: PageUpdate) {
    this.variableRenameService.getRenameActionsIfNeededForRoutes(page).subscribe(renameAction => {
      const actionsToExecute = [
        ...renameAction,
        PageActions.UpdatePage(page),
        WorkingAreaActions.SyncState(),
        ProjectActions.UpdateProject(),
        HistoryActions.Persist()
      ];
      actionsToExecute.forEach((action: Action) => dispatch(action));
    });
  }

  updateFilter(filter: string) {
    dispatch(PageActions.SetPageFilter(filter));
  }

  setActivePage(id: string, setFromKitchen: boolean): Observable<PuffComponent> {
    return getRootSpaceForPage(id).pipe(
      take(1),
      tap((rootSpace: PuffComponent) => {
        dispatch(ComponentActions.SelectComponent([rootSpace.id]));
        dispatch(PageActions.SetActivePage(id, setFromKitchen));
      })
    );
  }

  // TODO to much take(1)
  private getChildrenIdList(pageIdList: string[]): Observable<string[][]> {
    return getRootComponentIdAndSlotIdLists(pageIdList).pipe(
      take(1),
      switchMap(componentAndSlotIdLists => getSubComponentIds(componentAndSlotIdLists)),
      take(1),
      map(({ componentIdList, slotIdList }) => [pageIdList, componentIdList, slotIdList])
    );
  }
}
