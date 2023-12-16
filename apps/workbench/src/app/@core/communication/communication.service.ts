import { Inject, Injectable } from '@angular/core';
import { NB_WINDOW } from '@nebular/theme';
import { fromEvent, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import {
  Message,
  MessageAction,
  MessageData,
  OvenApp,
  OvenSettings,
  SentryInfo,
  BreakpointWidth,
  ActiveSetting,
  OvenUserNotifications,
  LocalStorageItem
} from '@common';

@Injectable({ providedIn: 'root' })
export class CommunicationService {
  readonly state$: Observable<OvenApp> = this.receivePayload<OvenApp>(MessageAction.SYNC_STATE);
  readonly selectedComponents$: Observable<string[]> = this.receivePayload<string[]>(
    MessageAction.SET_SELECTED_COMPONENT
  );
  readonly hoveredComponent$: Observable<string> = this.receivePayload<string>(MessageAction.SET_HOVERED_COMPONENT);
  readonly activePageUrl$: Observable<string> = this.receivePayload<string>(MessageAction.CHANGE_ACTIVE_PAGE);
  readonly showDevUI$: Observable<boolean> = this.receivePayload<boolean>(MessageAction.SHOW_DEV_UI);
  readonly makeThumbnail$: Observable<any> = this.receive<any>(MessageAction.MAKE_THUMBNAIL_REQUEST);
  readonly activeSetting$: Observable<ActiveSetting> = this.receivePayload<ActiveSetting>(
    MessageAction.ACTIVE_SETTING
  ).pipe(distinctUntilChanged());
  readonly sentryInfo$: Observable<SentryInfo> = this.receivePayload<SentryInfo>(MessageAction.SET_SENTRY_INFO);
  readonly privileges$: Observable<string[]> = this.receivePayload<string[]>(MessageAction.PRIVILEGES);
  readonly breakpoint$: Observable<BreakpointWidth> = this.receivePayload<BreakpointWidth>(MessageAction.BREAKPOINT);
  readonly settings$: Observable<OvenSettings> = this.receivePayload<OvenSettings>(MessageAction.SYNC_SETTINGS);
  readonly userNotifications$: Observable<OvenUserNotifications> = this.receivePayload<OvenUserNotifications>(
    MessageAction.USER_NOTIFICATIONS
  );
  readonly localStorageItems$: Observable<LocalStorageItem[]> = this.receivePayload<LocalStorageItem[]>(
    MessageAction.SET_LOCAL_STORAGE_ITEMS
  );

  constructor(@Inject(NB_WINDOW) private window) {
  }

  sendMessage(action: MessageAction) {
    this.send({ action });
  }

  sendMessageWithPayload<T>(action: MessageAction, payload: T) {
    this.send({ action, payload });
  }

  private send<T>(data: MessageData<T>) {
    this.window.parent.postMessage(data, '*');
  }

  private receive<T>(action: string): Observable<MessageData<T>> {
    return fromEvent(this.window, 'message').pipe(
      filter((message: Message<T>) => message.data.action === action),
      map((msg: Message<T>) => msg.data)
    );
  }

  private receivePayload<T>(action: string) {
    return this.receive(action).pipe(map((msgData: MessageData<T>) => msgData.payload));
  }
}
