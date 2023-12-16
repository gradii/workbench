import { Inject, Injectable } from '@angular/core';
import { NB_WINDOW } from '@nebular/theme';
import { fromEvent, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Update } from '@ngrx/entity';

import {
  AccessFeature,
  AddOvenComponent,
  BreakpointWidth,
  DivideSpace,
  Message,
  MessageAction,
  MessageData,
  MoveComponent,
  OvenApp,
  PasteComponent,
  RemoveOvenComponent,
  ResizeOvenSpace,
  SelectOvenComponent,
  SentryInfo,
  SyncReasonMsg,
  UpdateProperties,
  ActiveSetting,
  OvenSettings,
  UIActionIntent,
  OvenUserNotifications,
  CommitResizeOvenSpace,
  WorkflowLog,
  StoreItem,
  LocalStorageItem
} from '@common';

import { IframeProviderService } from './iframe-provider.service';

@Injectable({ providedIn: 'root' })
export class CommunicationService {
  readonly addComponent$: Observable<AddOvenComponent> = this.receivePayload(MessageAction.ADD_COMPONENT);
  readonly selectComponent$: Observable<SelectOvenComponent> = this.receivePayload(MessageAction.SELECT_COMPONENT);
  readonly removeComponent$: Observable<RemoveOvenComponent> = this.receivePayload(MessageAction.REMOVE_COMPONENT);
  readonly removeActiveComponents$: Observable<MessageData<void>> = this.receive(
    MessageAction.REMOVE_ACTIVE_COMPONENTS
  );
  readonly updateComponent$: Observable<UpdateProperties> = this.receivePayload(MessageAction.UPDATE_BINDINGS);
  readonly resizeSpace$: Observable<ResizeOvenSpace> = this.receivePayload(MessageAction.RESIZE_SPACE);
  readonly commitResizeSpace$: Observable<CommitResizeOvenSpace> = this.receivePayload(
    MessageAction.COMMIT_RESIZE_SPACE
  );
  readonly divideSpace$: Observable<DivideSpace> = this.receivePayload(MessageAction.DIVIDE_SPACE);
  readonly copy$: Observable<MessageData<void>> = this.receive(MessageAction.COPY);
  readonly paste$: Observable<PasteComponent> = this.receivePayload(MessageAction.PASTE);
  readonly cut$: Observable<MessageData<void>> = this.receive(MessageAction.CUT);
  readonly undo$: Observable<MessageData<void>> = this.receive(MessageAction.UNDO);
  readonly redo$: Observable<MessageData<void>> = this.receive(MessageAction.REDO);
  readonly clearClipboard$: Observable<MessageData<void>> = this.receive(MessageAction.CLEAR_CLIPBOARD);
  readonly moveComponent$: Observable<MoveComponent> = this.receivePayload(MessageAction.MOVE_COMPONENT);
  readonly thumbnail$: Observable<string> = this.receivePayload(MessageAction.MAKE_THUMBNAIL_RESPONSE);
  readonly ready$: Observable<void> = this.receivePayload(MessageAction.READY);
  readonly accessFeature$: Observable<AccessFeature> = this.receivePayload(MessageAction.ACCESS_FEATURE);
  readonly workbenchVersion$: Observable<number> = this.receivePayload(MessageAction.WORKBENCH_MODEL_VERSION);
  readonly incViewedResizeAltStick$: Observable<MessageData<void>> = this.receive<void>(
    MessageAction.INC_VIEWED_RESIZE_ALT_STICK_NOTIFICATION
  );

  readonly workflowLog$: Observable<WorkflowLog> = this.receivePayload(MessageAction.WORKFLOW_LOG);
  readonly connectDataSource$: Observable<MessageData<void>> = this.receive(UIActionIntent.CONNECT_DATA_SOURCE);
  readonly showSequenceSource$: Observable<MessageData<void>> = this.receive(UIActionIntent.SHOW_SEQUENCE_SOURCE);
  readonly fixDataSource$: Observable<MessageData<void>> = this.receive(UIActionIntent.FIX_DATA_SOURCE);
  readonly updateStoreItem$: Observable<Update<StoreItem>> = this.receivePayload(MessageAction.UPDATE_STORE_ITEM);
  readonly pageSelected$: Observable<{ id: string }> = this.receivePayload(MessageAction.PAGE_SELECTED);
  readonly updateLocalStorageItem$: Observable<LocalStorageItem> = this.receivePayload(
    MessageAction.UPDATE_LOCAL_STORAGE_ITEM
  );

  constructor(@Inject(NB_WINDOW) private window, private iframeProvider: IframeProviderService) {
  }

  sendState(state: OvenApp, syncReason?: SyncReasonMsg) {
    this.send({ action: MessageAction.SYNC_STATE, payload: { state, syncReason } });
  }

  // Sends user info for error logging purposes
  setSentryInfo(sentryInfo: SentryInfo) {
    this.send({ action: MessageAction.SET_SENTRY_INFO, payload: sentryInfo });
  }

  setSelectedComponents(selected: string[]) {
    this.send({ action: MessageAction.SET_SELECTED_COMPONENT, payload: selected });
  }

  setHoveredComponent(componentId: string) {
    this.send({ action: MessageAction.SET_HOVERED_COMPONENT, payload: componentId });
  }

  changeActivePage(url: string) {
    this.send({ action: MessageAction.CHANGE_ACTIVE_PAGE, payload: url });
  }

  showDevUI(show: boolean) {
    this.send({ action: MessageAction.SHOW_DEV_UI, payload: show });
  }

  makeThumbnail() {
    this.send({ action: MessageAction.MAKE_THUMBNAIL_REQUEST });
  }

  setPrivileges(privileges: string[]) {
    this.send({ action: MessageAction.PRIVILEGES, payload: privileges });
  }

  setBreakpoint(breakpoint: BreakpointWidth) {
    this.send({ action: MessageAction.BREAKPOINT, payload: breakpoint });
  }

  setActiveSetting(activeSetting: ActiveSetting) {
    this.send({ action: MessageAction.ACTIVE_SETTING, payload: activeSetting });
  }

  syncSettings(settings: OvenSettings): void {
    this.send({ action: MessageAction.SYNC_SETTINGS, payload: settings });
  }

  setUserNotifications(userNotifications: OvenUserNotifications): void {
    this.send({ action: MessageAction.USER_NOTIFICATIONS, payload: userNotifications });
  }

  setLocalStorageItems(items: LocalStorageItem[]) {
    this.send({ action: MessageAction.SET_LOCAL_STORAGE_ITEMS, payload: items });
  }

  private send<T>(data: MessageData<T>) {
    this.iframeProvider
      .getIframeWindow()
      .pipe(take(1))
      .subscribe((target: Window) => {
        target.postMessage(data, '*');
      });
  }

  private receive<T>(action: string): Observable<MessageData<T>> {
    return fromEvent(this.window, 'message').pipe(
      filter((message: Message<T>) => message.data.action === action),
      map((msg: Message<T>) => msg.data)
    );
  }

  private receivePayload<T>(action: string): Observable<T> {
    return this.receive(action).pipe(map((msgData: MessageData<T>) => msgData.payload));
  }
}
