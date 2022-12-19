import { Injectable } from '@angular/core';
import { PayloadService } from '@auth/payload.service';
import { KitchenApp, onlyLatestFrom } from '@common/public-api';
import { TriRoleProvider } from '@gradii/triangle/security';
import { createEffect, ofType } from '@ngneat/effects';

import { CommunicationService } from '@shared/communication/communication.service';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { PuffApp } from '@tools-state/app/app.model';
import { getAppState } from '@tools-state/app/app.selectors';
import { ComponentActions } from '@tools-state/component/component.actions';
import { getActiveComponentIdList } from '@tools-state/component/component.selectors';
import { HistoryActions } from '@tools-state/history/history.actions';
import { Page } from '@tools-state/page/page.model';
import { getActivePage, getActivePageFullUrl } from '@tools-state/page/page.selectors';
import { getActiveProjectId } from '@tools-state/project/project.selectors';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { getWorkingAreaMode } from '@tools-state/working-area/working-area.selectors';
import { debounceTime, filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { fromWorkingArea } from './working-area.reducer';

const { fromWorkingAreaStore } = fromWorkingArea;

const debounceDelay = 100;

@Injectable()
export class WorkingAreaEffects {
  constructor(
    private stateConverter: StateConverterService,
    private communication: CommunicationService,
    private payloadService: PayloadService,
    private roleProvider: TriRoleProvider
  ) {
  }

  syncState = createEffect((actions) => (
    actions.pipe(
      ofType(
        WorkingAreaActions.SyncState,
        HistoryActions.Forward,
        HistoryActions.Back
      ),
      withLatestFrom(getAppState),
      withLatestFrom(getActivePage),
      withLatestFrom(getWorkingAreaMode),
      map(([[[action, appState], page], mode]: [[[any, PuffApp], Page], WorkingAreaMode]) => {
        let app: KitchenApp;

        if (mode === WorkingAreaMode.PREVIEW || mode === WorkingAreaMode.PAINTER) {
          app = this.stateConverter.convertState(appState);
        } else {
          app = this.stateConverter.convertActivePageState(appState, page);
        }

        const { syncReason } = action;
        return WorkingAreaActions.SetKitchenState(app, syncReason);
      })
    )
  ), { dispatch: true });

  syncAll$ = createEffect((actions) => (
    actions.pipe(
      ofType(WorkingAreaActions.SyncAll),
      withLatestFrom(getAppState),
      map(([action, appState]: [any, PuffApp]) => {
        const app: KitchenApp = this.stateConverter.convertState(appState);
        const { syncReason }  = action;
        return WorkingAreaActions.SetKitchenState(app, syncReason);
      })
    )), { dispatch: true });

  pushKitchenApp = createEffect((actions) => (
    actions.pipe(
      ofType(WorkingAreaActions.SetKitchenState),
      tap(({ app, syncReason }) => this.communication.sendState(app, syncReason))
    )), { dispatch: false });

  navigate = createEffect((actions) => (
    actions.pipe(
      ofType(WorkingAreaActions.FinishLoading, WorkingAreaActions.ForcePageNavigation),
      debounceTime(debounceDelay),
      onlyLatestFrom(getActivePageFullUrl),
      filter(url => !!url),
      map((url: string) => this.communication.changeActivePage(url))
    )), { dispatch: false });

  showDevUI = createEffect((actions) => (
    actions.pipe(
      ofType(WorkingAreaActions.ChangeMode),
      debounceTime(debounceDelay),
      map((action) =>
        this.communication.showDevUI(
          action.mode === WorkingAreaMode.BUILDER ||
          action.mode === WorkingAreaMode.DATA
        )
      )
    )), { dispatch: false });

  selectedComponents = createEffect((actions) => (
    actions.pipe(
      ofType(
        ComponentActions.SelectComponent,
        HistoryActions.Forward,
        HistoryActions.Back
      ),
      withLatestFrom(
        getActiveComponentIdList,
        (_, selectedComponents: string[]) => selectedComponents
      ),
      tap((selectedComponents: string[]) => this.communication.setSelectedComponents(selectedComponents))
    )), { dispatch: false });

  hoveredComponent = createEffect((actions) => (
    actions.pipe(
      ofType(ComponentActions.HoveredComponent),
      tap((hoveredComponent) =>
        this.communication.setHoveredComponent(hoveredComponent.componentId)
      )
    )), { dispatch: false });

  syncUserInfo = createEffect((actions) => (
    actions.pipe(
      ofType(WorkingAreaActions.FinishLoading),
      mergeMap(() => getActiveProjectId),
      withLatestFrom(this.payloadService.payload$),
      tap(([projectId, { email }]) => this.communication.setSentryInfo({ projectId, email }))
    )), { dispatch: false });

  syncPermissions = createEffect((actions) => (
    actions.pipe(
      ofType(WorkingAreaActions.FinishLoading),
      mergeMap(() => this.roleProvider.getRole()),
      tap((privileges: string[]) => this.communication.setPrivileges(privileges))
    )), { dispatch: false });
}
