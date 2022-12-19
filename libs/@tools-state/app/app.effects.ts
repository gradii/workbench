import { Injectable } from '@angular/core';
import { createEffect, ofType } from '@ngneat/effects';
import { AppActions } from '@tools-state/app/app.actions';
import { PuffApp } from '@tools-state/app/app.model';
import { ComponentActions } from '@tools-state/component/component.actions';
import { PuffComponent } from '@tools-state/component/component.model';
import { ActionDiagramActions } from '@tools-state/data/action-diagram/action-diagram.actions';
import { ActionFlowActions } from '@tools-state/data/action-flow/action-flow.actions';
import { StoreItemActions } from '@tools-state/data/store-item/store-item.actions';
import { WorkflowActions } from '@tools-state/data/workflow/workflow.actions';
import { FeatureActions } from '@tools-state/feature/feature.actions';
import { HistoryActions } from '@tools-state/history/history.actions';

import { LayoutActions } from '@tools-state/layout/layout.actions';
import { PageTreeHelper } from '@tools-state/page/page-tree.helper';
import { PageActions } from '@tools-state/page/page.actions';
import { Page } from '@tools-state/page/page.model';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class AppEffects {
  constructor() {
  }

  initApp = createEffect(actions => actions.pipe(
    ofType(AppActions.InitApplication),
    mergeMap((action) => {
      const app: PuffApp  = action.state;
      const pages: Page[] = PageTreeHelper.flatPageTreeList(app.rootPageList);
      const activePage: Page                 = pages[0];
      const rootSlot: PuffSlot                 = app.slotList.find((slot: PuffSlot) => slot.parentPageId === activePage.id);
      const activeComponent: PuffComponent = app.componentList.find(
        (c: PuffComponent) => c.parentSlotId === rootSlot.id
      );
      return [
        PageActions.ReplaceWithPageList(pages),
        ComponentActions.ReplaceWithComponentList(app.componentList),
        FeatureActions.ReplaceWithFeatureList(app.featureList),
        LayoutActions.SetLayout(app.layout),
        SlotActions.ReplaceWithSlotList(app.slotList),
        PageActions.SetActivePage(activePage.id, false),
        ComponentActions.SelectComponent([activeComponent.id]),
        ActionDiagramActions.AddActionDiagramList(action.state.actionDiagramList || []),
        ActionFlowActions.AddActionFlowList(action.state.actionFlowList || []),
        WorkflowActions.AddWorkflowList(action.state.workflowList || []),
        StoreItemActions.ReplaceStoreItemList(action.state.storeItemList || []),
        WorkingAreaActions.SyncState(),
        HistoryActions.Persist()
      ];
    })
  ), { dispatch: true });
}
