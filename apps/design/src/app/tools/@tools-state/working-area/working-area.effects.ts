import { Injectable } from '@angular/core';
import { onlyLatestFrom, OvenApp } from '@common';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { debounceTime, filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { NbRoleProvider } from '@nebular/security';

import { CommunicationService } from '@shared/communication/communication.service';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { PayloadService } from '@auth/payload.service';
import { HistoryActions } from '@tools-state/history/history.actions';
import { BakeryApp } from '@tools-state/app/app.model';
import { getAppState } from '@tools-state/app/app.selectors';
import { getActivePage, getActivePageFullUrl } from '@tools-state/page/page.selectors';
import { fromTools } from '@tools-state/tools.reducer';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { getActiveProjectId } from '@tools-state/project/project.selectors';
import { ComponentActions } from '@tools-state/component/component.actions';
import { getActiveComponentIdList } from '@tools-state/component/component.selectors';
import { Page } from '@tools-state/page/page.model';
import { getWorkingAreaMode } from '@tools-state/working-area/working-area.selectors';

const debounceDelay = 100;

@Injectable()
export class WorkingAreaEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromTools.State>,
    private stateConverter: StateConverterService,
    private communication: CommunicationService,
    private payloadService: PayloadService,
    private roleProvider: NbRoleProvider
  ) {
  }

  @Effect()
  syncState = this.actions$.pipe(
    ofType(
      WorkingAreaActions.ActionTypes.SyncState,
      HistoryActions.ActionTypes.Forward,
      HistoryActions.ActionTypes.Back
    ),
    withLatestFrom(this.store.pipe(select(getAppState))),
    withLatestFrom(this.store.pipe(select(getActivePage))),
    withLatestFrom(this.store.pipe(select(getWorkingAreaMode))),
    map(([[[action, appState], page], mode]: [[[any, BakeryApp], Page], WorkingAreaMode]) => {
      let app: OvenApp;

      if (mode === WorkingAreaMode.PREVIEW || mode === WorkingAreaMode.PAINTER) {
        app = this.stateConverter.convertState(appState);
      } else {
        app = this.stateConverter.convertActivePageState(appState, page);
      }

      const { syncReason } = action;
      return new WorkingAreaActions.SetOvenState(app, syncReason);
    })
  );

  @Effect()
  syncAll$ = this.actions$.pipe(
    ofType(WorkingAreaActions.ActionTypes.SyncAll),
    withLatestFrom(this.store.pipe(select(getAppState))),
    map(([action, appState]: [any, BakeryApp]) => {
      const app: OvenApp = this.stateConverter.convertState(appState);
      const { syncReason } = action;
      return new WorkingAreaActions.SetOvenState(app, syncReason);
    })
  );

  @Effect({ dispatch: false })
  pushOvenApp = this.actions$.pipe(
    ofType(WorkingAreaActions.ActionTypes.SetOvenState),
    tap(({ app, syncReason }) => this.communication.sendState(app, syncReason))
  );

  @Effect({ dispatch: false })
  navigate = this.actions$.pipe(
    ofType(WorkingAreaActions.ActionTypes.FinishLoading, WorkingAreaActions.ActionTypes.ForcePageNavigation),
    debounceTime(debounceDelay),
    onlyLatestFrom(this.store.pipe(select(getActivePageFullUrl))),
    filter(url => !!url),
    map((url: string) => this.communication.changeActivePage(url))
  );

  @Effect({ dispatch: false })
  showDevUI = this.actions$.pipe(
    ofType(WorkingAreaActions.ActionTypes.ChangeMode),
    debounceTime(debounceDelay),
    map((action: WorkingAreaActions.ChangeMode) =>
      this.communication.showDevUI(action.mode === WorkingAreaMode.BUILDER || action.mode === WorkingAreaMode.DATA)
    )
  );

  @Effect({ dispatch: false })
  selectedComponents = this.actions$.pipe(
    ofType(
      ComponentActions.ActionTypes.SelectComponent,
      HistoryActions.ActionTypes.Forward,
      HistoryActions.ActionTypes.Back
    ),
    withLatestFrom(
      this.store.pipe(select(getActiveComponentIdList)),
      (_, selectedComponents: string[]) => selectedComponents
    ),
    tap((selectedComponents: string[]) => this.communication.setSelectedComponents(selectedComponents))
  );

  @Effect({ dispatch: false })
  hoveredComponent = this.actions$.pipe(
    ofType(ComponentActions.ActionTypes.HoveredComponent),
    tap((hoveredComponent: ComponentActions.HoveredComponent) =>
      this.communication.setHoveredComponent(hoveredComponent.componentId)
    )
  );

  @Effect({ dispatch: false })
  syncUserInfo = this.actions$.pipe(
    ofType(WorkingAreaActions.ActionTypes.FinishLoading),
    mergeMap(() => this.store.pipe(select(getActiveProjectId))),
    withLatestFrom(this.payloadService.payload$),
    tap(([projectId, { email }]) => this.communication.setSentryInfo({ projectId, email }))
  );

  @Effect({ dispatch: false })
  syncPermissions = this.actions$.pipe(
    ofType(WorkingAreaActions.ActionTypes.FinishLoading),
    mergeMap(() => this.roleProvider.getRole()),
    tap((privileges: string[]) => this.communication.setPrivileges(privileges))
  );
}
