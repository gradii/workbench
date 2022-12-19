import {
  DivideSpaceType, KitchenApp, KitchenComponent, KitchenFeature, SlotBindings, SpaceHeight, SpaceWidth
} from './kitchen.models';

export enum StateAction {
  SYNC_STATE                               = 'SYNC_STATE',
  CHANGE_ACTIVE_PAGE                       = 'CHANGE_ACTIVE_PAGE',
  ADD_COMPONENT                            = 'ADD_COMPONENT',
  REMOVE_COMPONENT                         = 'REMOVE_COMPONENT',
  REMOVE_ACTIVE_COMPONENTS                 = 'REMOVE_ACTIVE_COMPONENTS',
  SELECT_COMPONENT                         = 'SELECT_COMPONENT',
  SET_SELECTED_COMPONENT                   = 'SET_SELECTED_COMPONENT',
  SET_HOVERED_COMPONENT                    = 'SET_HOVERED_COMPONENT',
  UPDATE_BINDINGS                          = 'UPDATE_BINDINGS',
  RESIZE_SPACE                             = 'RESIZE_SPACE',
  COMMIT_RESIZE_SPACE                      = 'COMMIT_RESIZE_SPACE',
  COPY                                     = 'COPY',
  PASTE                                    = 'PASTE',
  CUT                                      = 'CUT',
  UNDO                                     = 'UNDO',
  REDO                                     = 'REDO',
  CLEAR_CLIPBOARD                          = 'CLEAR_CLIPBOARD',
  SHOW_DEV_UI                              = 'SHOW_DEV_UI',
  MOVE_COMPONENT                           = 'MOVE_COMPONENT',
  MOVE_ITEM_IN_ARRAY                       = 'MOVE_ITEM_IN_ARRAY',
  TRANSFER_ARRAY_ITEM                      = 'TRANSFER_ARRAY_ITEM',
  DIVIDE_SPACE                             = 'DIVIDE_SPACE',
  MAKE_THUMBNAIL_REQUEST                   = 'MAKE_THUMBNAIL_REQUEST',
  MAKE_THUMBNAIL_RESPONSE                  = 'MAKE_THUMBNAIL_RESPONSE',
  WORKBENCH_MODEL_VERSION                  = 'WORKBENCH_MODEL_VERSION',
  SET_SENTRY_INFO                          = 'SET_SENTRY_INFO',
  READY                                    = 'READY',
  PRIVILEGES                               = 'PRIVILEGES',
  ACCESS_FEATURE                           = 'ACCESS_FEATURE',
  BREAKPOINT                               = 'BREAKPOINT',
  ACTIVE_SETTING                           = 'ACTIVE_SETTING',
  SYNC_SETTINGS                            = 'SYNC_SETTINGS',
  USER_NOTIFICATIONS                       = 'USER_NOTIFICATIONS',
  INC_VIEWED_RESIZE_ALT_STICK_NOTIFICATION = 'INC_VIEWED_RESIZE_ALT_STICK_NOTIFICATION',
  WORKFLOW_LOG                             = 'WORKFLOW_LOG',
  UPDATE_STORE_ITEM                        = 'UPDATE_STORE_ITEM',
  UPDATE_LOCAL_STORAGE_ITEM                = 'UPDATE_LOCAL_STORAGE_ITEM',
  SET_LOCAL_STORAGE_ITEMS                  = 'SET_LOCAL_STORAGE_ITEMS',
  PAGE_SELECTED                            = 'PAGE_SELECTED',

  ADD_FEATURE                              = 'ADD_FEATURE',
  REMOVE_FEATURE                           = 'REMOVE_FEATURE',
  UPDATE_FEATURE_BINDINGS                  = 'UPDATE_FEATURE_BINDINGS'
}

export enum UIActionIntent {
  CONNECT_DATA_SOURCE  = 'CONNECT_DATA_SOURCE',
  FIX_DATA_SOURCE      = 'FIX_DATA_SOURCE',
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

export interface ResizeKitchenSpace {
  component: KitchenComponent;
  width: SpaceWidth;
  height: SpaceHeight;
}

export interface CommitResizeKitchenSpace {
  stickMode: boolean;
}

export interface AddKitchenComponent {
  parentSlotId: string;
  index: number;
  component: KitchenComponent;
  widgetName?: string;
}

export interface RemoveKitchenComponent {
  // parentSlotId: string;
  component: KitchenComponent;
}

export interface AddKitchenFeature {
  hostId: string;
  index: number;
  feature: KitchenFeature;
  widgetName?: string;
}

export interface RemoveKitchenFeature {
  hostId: string;
  feature: KitchenFeature;
}

export interface PasteComponent {
  type: string;
  selectedComponents?: KitchenComponent[];
  image?: KitchenComponent;
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

export interface SelectKitchenComponent {
  multi: boolean;
  component: KitchenComponent;
}

export interface MoveComponent {
  component: KitchenComponent;
  parentSlotId: string;
  position: number;
}

export interface MoveItemInArrayComponent {
  component: KitchenComponent;
  currentContainer: any;
  parentSlotId: string;
  currentIndex: number;
  targetIndex: number;
}

export interface TransferArrayItemComponent {
  component: KitchenComponent;
  currentContainer: any;
  targetContainer: any;
  currentIndex: number;
  targetIndex: number;
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
  WorkingArea   = 'WorkingArea',
}

export type Feature = 'widget' | 'page' | 'painter' | 'theme' | 'component' | 'template';

export interface AccessFeature {
  feature: Feature;
  element?: string;
}

export interface SyncMsg {
  state: KitchenApp;
  syncReason: SyncReasonMsg;
}

export type SyncReason = 'paste' | 'unknown' | 'breakpointChange';

export interface SyncReasonMsg<T = any> {
  readonly reason: SyncReason;
  readonly data: T;
}

export class UnknownSyncReason implements SyncReasonMsg<null> {
  readonly reason = 'unknown';
  readonly data   = null;
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
  readonly data   = null;
}

export type ActiveSetting = 'margin-padding' | 'margin' | 'padding' | null;

export interface KitchenSettings {
  xray: boolean;
}

export const DEFAULT_SETTINGS: KitchenSettings = { xray: true };

export interface KitchenUserNotifications {
  viewedResizeAltStick: boolean;
}

export const DEFAULT_USER_NOTIFICATIONS: KitchenUserNotifications = { viewedResizeAltStick: true };
