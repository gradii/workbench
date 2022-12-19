import { Injectable } from '@angular/core';
import {
  ActiveSetting, BreakpointWidth, DEFAULT_USER_NOTIFICATIONS, KitchenApp, KitchenPage, KitchenSettings,
  KitchenUserNotifications, MessageAction, SyncMsg
} from '@common/public-api';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map, shareReplay, tap } from 'rxjs/operators';
import { ModelCompiler } from '../model-compiler/model-compiler.service';

import { AppState, GlobalStateService } from '../workflow/global-state.service';
import { InitialStateService } from '../workflow/initial-state.service';

const initialState: SyncMsg = {
  state     : {
    pageList         : [],
    header           : null,
    sidebar          : null,
    layout           : null,
    theme            : null,
    actionDiagramList: [],
    actionFlowList   : [],
    workflowList     : [],
    storeItemList    : [],
    favicon          : null,
    code             : null,
    uiPropertyData   : []
  },
  syncReason: null
};

@Injectable(/*{ providedIn: 'root' }*/)
export class KitchenState {
  private readonly syncMsg: BehaviorSubject<SyncMsg> = new BehaviorSubject(initialState);
  readonly syncMsg$: Observable<SyncMsg>             = this.syncMsg
    .asObservable()
    .pipe(tap((msg: SyncMsg) => this.initialStateService.updateInitialState(msg.state)));

  readonly app$: Observable<KitchenApp> = this.syncMsg$.pipe(map((msg: SyncMsg) => msg.state));

  readonly activeComponentIdList: BehaviorSubject<string[]> = new BehaviorSubject([]);
  readonly activeComponentIdList$: Observable<string[]>     = this.activeComponentIdList.asObservable();

  readonly hoveredComponentId: BehaviorSubject<string> = new BehaviorSubject('');
  readonly hoveredComponentId$: Observable<string>     = this.hoveredComponentId.asObservable();

  private readonly activePage: BehaviorSubject<KitchenPage> = new BehaviorSubject(null);
  readonly activePage$: Observable<KitchenPage>             = this.activePage.asObservable();

  private readonly showDevUI: BehaviorSubject<boolean> = new BehaviorSubject(true);
  readonly showDevUI$: Observable<boolean>             = this.showDevUI.asObservable();

  private readonly privileges: BehaviorSubject<string[]> = new BehaviorSubject([]);
  readonly privileges$: Observable<string[]>             = this.privileges.asObservable();

  private readonly activeBreakpoint                       = new Subject<BreakpointWidth>();
  readonly activeBreakpoint$: Observable<BreakpointWidth> = this.activeBreakpoint.asObservable();

  private readonly activeSetting                     = new Subject<ActiveSetting>();
  readonly activeSetting$: Observable<ActiveSetting> = this.activeSetting.asObservable();

  private readonly settings                       = new Subject<KitchenSettings>();
  readonly settings$: Observable<KitchenSettings> = this.settings.asObservable();

  private readonly userNotifications: BehaviorSubject<KitchenUserNotifications> = new BehaviorSubject(
    DEFAULT_USER_NOTIFICATIONS
  );
  readonly userNotifications$: Observable<KitchenUserNotifications>             = this.userNotifications.asObservable();

  // private readonly previewContainerElement: BehaviorSubject<HTMLElement> = new BehaviorSubject(
  //   null
  // );
  // readonly previewContainerElement$: Observable<HTMLElement>             = this.previewContainerElement.asObservable();


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

  private readonly message                                             = new Subject<{ type: MessageAction; payload: any }>();
  readonly message$: Observable<{ type: MessageAction; payload: any }> = this.message.asObservable();

  i = -1;
  constructor(
    private modelCompiler: ModelCompiler,
    private globalState: GlobalStateService,
    private initialStateService: InitialStateService
  ) {
    if (this.i > 0) {
      throw new Error('KitchenState is singleton');
    }
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

  setActivePage(page: KitchenPage) {
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

  setSettings(settings: KitchenSettings) {
    this.settings.next(settings);
  }

  setHoveredComponent(selected: string) {
    this.hoveredComponentId.next(selected);
  }

  setUserNotifications(userNotifications: KitchenUserNotifications): void {
    this.userNotifications.next(userNotifications);
  }

  // setPreviewContainerElement(containerElement: HTMLElement) {
  //   this.previewContainerElement.next(containerElement);
  // }
}
