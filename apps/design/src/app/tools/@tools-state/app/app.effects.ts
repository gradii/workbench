import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { StoreItemActions } from '@tools-state/data/store-item/store-item.actions';
import { WorkflowActions } from '@tools-state/data/workflow/workflow.actions';
import { mergeMap } from 'rxjs/operators';

import { LayoutActions } from '@tools-state/layout/layout.actions';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { HistoryActions } from '@tools-state/history/history.actions';
import { BakeryComponent } from '@tools-state/component/component.model';
import { Slot } from '@tools-state/slot/slot.model';
import { BakeryApp } from '@tools-state/app/app.model';
import { PageActions } from '@tools-state/page/page.actions';
import { AppActions } from '@tools-state/app/app.actions';
import { ComponentActions } from '@tools-state/component/component.actions';
import { PageTreeHelper } from '@tools-state/page/page-tree.helper';
import { Page } from '@tools-state/page/page.model';
import { SlotActions } from '@tools-state/slot/slot.actions';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions) {
  }

  @Effect()
  initApp = this.actions$.pipe(
    ofType(AppActions.ActionTypes.InitApplication),
    mergeMap((action: AppActions.InitApplication) => {
      const app: BakeryApp = action.state;
      const pages: Page[] = PageTreeHelper.flatPageTreeList(app.rootPageList);
      const activePage: Page = pages[0];
      const rootSlot: Slot = app.slotList.find((slot: Slot) => slot.parentPageId === activePage.id);
      const activeComponent: BakeryComponent = app.componentList.find(
        (c: BakeryComponent) => c.parentSlotId === rootSlot.id
      );
      return [
        new PageActions.ReplaceWithPageList(pages),
        new ComponentActions.ReplaceWithComponentList(app.componentList),
        new LayoutActions.SetLayout(app.layout),
        new SlotActions.ReplaceWithSlotList(app.slotList),
        new PageActions.SetActivePage(activePage.id, false),
        new ComponentActions.SelectComponent([activeComponent.id]),
        WorkflowActions.addWorkflowList({ workflowList: action.state.workflowList || [] }),
        StoreItemActions.replaceStoreItemList({ list: action.state.storeItemList || [] }),
        new WorkingAreaActions.SyncState(),
        new HistoryActions.Persist()
      ];
    })
  );
}
