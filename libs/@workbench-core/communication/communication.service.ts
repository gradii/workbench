import { Inject, Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import {
  Message,
  MessageAction,
  MessageData,
  KitchenApp,
  KitchenSettings,
  SentryInfo,
  BreakpointWidth,
  ActiveSetting,
  KitchenUserNotifications,
  LocalStorageItem,
} from '@common/public-api';


const postMessage = new Subject<MessageData<any>>();

/**
 * workbench area communication to shell
 */
@Injectable({ providedIn: 'root' })
export class CommunicationService {
  readonly state$: Observable<KitchenApp> = this.receivePayload<KitchenApp>(
    MessageAction.SYNC_STATE
  );
  readonly selectedComponents$: Observable<string[]> = this.receivePayload<
    string[]
  >(MessageAction.SET_SELECTED_COMPONENT);
  readonly hoveredComponent$: Observable<string> = this.receivePayload<string>(
    MessageAction.SET_HOVERED_COMPONENT
  );
  readonly activePageUrl$: Observable<string> = this.receivePayload<string>(
    MessageAction.CHANGE_ACTIVE_PAGE
  );
  readonly showDevUI$: Observable<boolean> = this.receivePayload<boolean>(
    MessageAction.SHOW_DEV_UI
  );
  readonly makeThumbnail$: Observable<any> = this.receive<any>(
    MessageAction.MAKE_THUMBNAIL_REQUEST
  );
  readonly activeSetting$: Observable<ActiveSetting> =
    this.receivePayload<ActiveSetting>(MessageAction.ACTIVE_SETTING).pipe(
      distinctUntilChanged()
    );
  readonly sentryInfo$: Observable<SentryInfo> =
    this.receivePayload<SentryInfo>(MessageAction.SET_SENTRY_INFO);
  readonly privileges$: Observable<string[]> = this.receivePayload<string[]>(
    MessageAction.PRIVILEGES
  );
  readonly breakpoint$: Observable<BreakpointWidth> =
    this.receivePayload<BreakpointWidth>(MessageAction.BREAKPOINT);
  readonly settings$: Observable<KitchenSettings> =
    this.receivePayload<KitchenSettings>(MessageAction.SYNC_SETTINGS);
  readonly userNotifications$: Observable<KitchenUserNotifications> =
    this.receivePayload<KitchenUserNotifications>(
      MessageAction.USER_NOTIFICATIONS
    );
  readonly localStorageItems$: Observable<LocalStorageItem[]> =
    this.receivePayload<LocalStorageItem[]>(
      MessageAction.SET_LOCAL_STORAGE_ITEMS
    );

  constructor() {}

  sendMessage(action: MessageAction) {
    this.send({ action });
  }

  sendMessageWithPayload<T>(action: MessageAction, payload: T) {
    this.send({ action, payload });
  }

  private send<T>(data: MessageData<T>) {
    // if iframe
    window.parent.postMessage(data, '*');

    // postMessage.next(data);
  }

  private receive<T>(action: string): Observable<MessageData<T>> {
    // if iframe
    return fromEvent(window, 'message').pipe(
      filter((message: Message<T>) => message.data.action === action),
      map((msg: Message<T>) => msg.data)
    );

    // return postMessage.asObservable().pipe(
    //   filter((message: MessageData<T>) => message.action === action),
    //   map((msg: MessageData<T>) => msg)
    // );

  }

  private receivePayload<T>(action: string) {
    return this.receive(action).pipe(
      map((msgData: MessageData<T>) => msgData.payload)
    );
  }
}
