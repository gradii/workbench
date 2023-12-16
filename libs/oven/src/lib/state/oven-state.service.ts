import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import {
  ActiveSetting,
  BreakpointWidth,
  DEFAULT_USER_NOTIFICATIONS,
  MessageAction,
  OvenApp,
  OvenPage,
  OvenSettings,
  OvenUserNotifications,
  SyncMsg
} from '@common';
import { debounceTime, map, shareReplay, tap } from 'rxjs/operators';

import { AppState, GlobalStateService } from '../workflow/global-state.service';
import { ModelCompiler } from '../model-compiler/model-compiler.service';
import { InitialStateService } from '../workflow/initial-state.service';

const initialState: SyncMsg = {
  state: {
    pageList: [],
    header: null,
    sidebar: null,
    layout: null,
    theme: null,
    workflowList: [],
    storeItemList: [],
    favicon: null,
    code: null,
    uiPropertyData: []
  },
  syncReason: null
};

@Injectable({ providedIn: 'root' })
export class OvenState {
  private readonly syncMsg: BehaviorSubject<SyncMsg> = new BehaviorSubject(initialState);
  readonly syncMsg$: Observable<SyncMsg> = this.syncMsg
    .asObservable()
    .pipe(tap((msg: SyncMsg) => this.initialStateService.updateInitialState(msg.state)));

  readonly app$: Observable<OvenApp> = this.syncMsg$.pipe(map((msg: SyncMsg) => msg.state));

  readonly activeComponentIdList: BehaviorSubject<string[]> = new BehaviorSubject([]);
  readonly activeComponentIdList$: Observable<string[]> = this.activeComponentIdList.asObservable();

  readonly hoveredComponentId: BehaviorSubject<string> = new BehaviorSubject('');
  readonly hoveredComponentId$: Observable<string> = this.hoveredComponentId.asObservable();

  private readonly activePage: BehaviorSubject<OvenPage> = new BehaviorSubject(null);
  readonly activePage$: Observable<OvenPage> = this.activePage.asObservable();

  private readonly showDevUI: BehaviorSubject<boolean> = new BehaviorSubject(true);
  readonly showDevUI$: Observable<boolean> = this.showDevUI.asObservable();

  private readonly privileges: BehaviorSubject<string[]> = new BehaviorSubject([]);
  readonly privileges$: Observable<string[]> = this.privileges.asObservable();

  private readonly activeBreakpoint = new Subject<BreakpointWidth>();
  readonly activeBreakpoint$: Observable<BreakpointWidth> = this.activeBreakpoint.asObservable();

  private readonly activeSetting = new Subject<ActiveSetting>();
  readonly activeSetting$: Observable<ActiveSetting> = this.activeSetting.asObservable();

  private readonly settings = new Subject<OvenSettings>();
  readonly settings$: Observable<OvenSettings> = this.settings.asObservable();

  private readonly userNotifications: BehaviorSubject<OvenUserNotifications> = new BehaviorSubject(
    DEFAULT_USER_NOTIFICATIONS
  );
  readonly userNotifications$: Observable<OvenUserNotifications> = this.userNotifications.asObservable();

  readonly syncMsgCompiled$: Observable<SyncMsg> = combineLatest([
    this.syncMsg$,
    this.globalState.state$,
    this.showDevUI$
  ]).pipe(
    // prevent component.service.bake calls after every update
    // TODO remove when batch updates will be implemented
    debounceTime(10),
    map(([syncMsg, state, showDevUI]: [SyncMsg, AppState, boolean]) => {
      return this.modelCompiler.compile(syncMsg, state, !showDevUI);
    }),
    shareReplay(1)
  );

  private readonly message = new Subject<{ type: MessageAction; payload: any }>();
  readonly message$: Observable<{ type: MessageAction; payload: any }> = this.message.asObservable();

  constructor(
    private modelCompiler: ModelCompiler,
    private globalState: GlobalStateService,
    private initialStateService: InitialStateService
  ) {
  }

  sync(syncMsg: SyncMsg) {
    this.syncMsg.next(syncMsg);
  }

  emitMessage<T>(type: MessageAction, payload?: T) {
    this.message.next({ type, payload });
  }

  setActiveComponentIdList(selected: string[]) {
    this.activeComponentIdList.next(selected);
  }

  setActivePage(page: OvenPage) {
    this.activePage.next(page);
  }

  setShowDevUI(show: boolean) {
    this.showDevUI.next(show);
  }

  setPrivileges(privileges: string[]) {
    this.privileges.next(privileges);
  }

  setActiveBreakpoint(breakpoint: BreakpointWidth) {
    this.activeBreakpoint.next(breakpoint);
  }

  setActiveSetting(activeSetting: ActiveSetting) {
    this.activeSetting.next(activeSetting);
  }

  setSettings(settings: OvenSettings) {
    this.settings.next(settings);
  }

  setHoveredComponent(selected: string) {
    this.hoveredComponentId.next(selected);
  }

  setUserNotifications(userNotifications: OvenUserNotifications): void {
    this.userNotifications.next(userNotifications);
  }
}
