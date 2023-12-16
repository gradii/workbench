import { DivideSpaceType, OvenApp, OvenComponent, SlotBindings, SpaceHeight, SpaceWidth } from './oven.models';

export enum StateAction {
  SYNC_STATE = 'SYNC_STATE',
  CHANGE_ACTIVE_PAGE = 'CHANGE_ACTIVE_PAGE',
  ADD_COMPONENT = 'ADD_COMPONENT',
  REMOVE_COMPONENT = 'REMOVE_COMPONENT',
  REMOVE_ACTIVE_COMPONENTS = 'REMOVE_ACTIVE_COMPONENTS',
  SELECT_COMPONENT = 'SELECT_COMPONENT',
  SET_SELECTED_COMPONENT = 'SET_SELECTED_COMPONENT',
  SET_HOVERED_COMPONENT = 'SET_HOVERED_COMPONENT',
  UPDATE_BINDINGS = 'UPDATE_BINDINGS',
  RESIZE_SPACE = 'RESIZE_SPACE',
  COMMIT_RESIZE_SPACE = 'COMMIT_RESIZE_SPACE',
  COPY = 'COPY',
  PASTE = 'PASTE',
  CUT = 'CUT',
  UNDO = 'UNDO',
  REDO = 'REDO',
  CLEAR_CLIPBOARD = 'CLEAR_CLIPBOARD',
  SHOW_DEV_UI = 'SHOW_DEV_UI',
  MOVE_COMPONENT = 'MOVE_COMPONENT',
  DIVIDE_SPACE = 'DIVIDE_SPACE',
  MAKE_THUMBNAIL_REQUEST = 'MAKE_THUMBNAIL_REQUEST',
  MAKE_THUMBNAIL_RESPONSE = 'MAKE_THUMBNAIL_RESPONSE',
  WORKBENCH_MODEL_VERSION = 'WORKBENCH_MODEL_VERSION',
  SET_SENTRY_INFO = 'SET_SENTRY_INFO',
  READY = 'READY',
  PRIVILEGES = 'PRIVILEGES',
  ACCESS_FEATURE = 'ACCESS_FEATURE',
  BREAKPOINT = 'BREAKPOINT',
  ACTIVE_SETTING = 'ACTIVE_SETTING',
  SYNC_SETTINGS = 'SYNC_SETTINGS',
  USER_NOTIFICATIONS = 'USER_NOTIFICATIONS',
  INC_VIEWED_RESIZE_ALT_STICK_NOTIFICATION = 'INC_VIEWED_RESIZE_ALT_STICK_NOTIFICATION',
  WORKFLOW_LOG = 'WORKFLOW_LOG',
  UPDATE_STORE_ITEM = 'UPDATE_STORE_ITEM',
  UPDATE_LOCAL_STORAGE_ITEM = 'UPDATE_LOCAL_STORAGE_ITEM',
  SET_LOCAL_STORAGE_ITEMS = 'SET_LOCAL_STORAGE_ITEMS',
  PAGE_SELECTED = 'PAGE_SELECTED',
}

export enum UIActionIntent {
  CONNECT_DATA_SOURCE = 'CONNECT_DATA_SOURCE',
  FIX_DATA_SOURCE = 'FIX_DATA_SOURCE',
  SHOW_SEQUENCE_SOURCE = 'SHOW_SEQUENCE_SOURCE',
}

export const MessageAction = { ...StateAction, ...UIActionIntent };
export type MessageAction = StateAction | UIActionIntent;

export interface Message<T> extends MessageEvent {
  data: MessageData<T>;
}

export class MessageData<T> {
  constructor(public action: string, public payload?: T) {
  }
}

export interface ResizeSpace {
  id: string;
  width: SpaceWidth;
  height: SpaceHeight;
}

export interface ResizeOvenSpace {
  component: OvenComponent;
  width: SpaceWidth;
  height: SpaceHeight;
}

export interface CommitResizeOvenSpace {
  stickMode: boolean;
}

export interface AddOvenComponent {
  parentSlotId: string;
  index: number;
  component: OvenComponent;
  widgetName?: string;
}

export interface RemoveOvenComponent {
  parentSlotId: string;
  component: OvenComponent;
}

export interface PasteComponent {
  type: string;
  selectedComponents?: OvenComponent[];
  image?: OvenComponent;
  id?: string;
  error?: string;
}

export interface UpdateSlotBindings {
  slotId: string;
  bindings: SlotBindings;
}

export interface UpdateProperties {
  id: string;
  properties?: { [key: string]: any };
}

export interface SelectOvenComponent {
  multi: boolean;
  component: OvenComponent;
}

export interface MoveComponent {
  component: OvenComponent;
  parentSlotId: string;
  position: number;
}

export interface SentryInfo {
  projectId: string;
  email: string;
}

export interface DivideSpace {
  id: string;
  type: DivideSpaceType;
}

export enum ExecuteSourceType {
  ComponentTree = 'ComponentTree',
  WorkingArea = 'WorkingArea',
}

export type Feature = 'widget' | 'page' | 'painter' | 'theme' | 'component' | 'template';

export interface AccessFeature {
  feature: Feature;
  element?: string;
}

export interface SyncMsg {
  state: OvenApp;
  syncReason: SyncReasonMsg;
}

export type SyncReason = 'paste' | 'unknown' | 'breakpointChange';

export interface SyncReasonMsg<T = any> {
  readonly reason: SyncReason;
  readonly data: T;
}

export class UnknownSyncReason implements SyncReasonMsg<null> {
  readonly reason = 'unknown';
  readonly data = null;
}

export class PasteSyncReason implements SyncReasonMsg<{ componentId: string }> {
  readonly reason = 'paste';
  readonly data;

  constructor(componentId: string) {
    this.data = { componentId };
  }
}

export class BreakpointChangeSyncReason implements SyncReasonMsg<null> {
  readonly reason = 'breakpointChange';
  readonly data = null;
}

export type ActiveSetting = 'margin-padding' | 'margin' | 'padding' | null;

export interface OvenSettings {
  xray: boolean;
}

export const DEFAULT_SETTINGS: OvenSettings = { xray: true };

export interface OvenUserNotifications {
  viewedResizeAltStick: boolean;
}

export const DEFAULT_USER_NOTIFICATIONS: OvenUserNotifications = { viewedResizeAltStick: true };
