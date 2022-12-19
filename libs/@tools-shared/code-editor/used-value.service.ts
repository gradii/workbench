import { Injectable } from '@angular/core';
import { ActiveRouteId, COMMON_VARIABLE_NAME_PATTERN, nextId, StepType } from '@common/public-api';
import { camelize } from '@angular-devkit/core/src/utils/strings';

import { SelectorOption } from './store-item-selector.component';

export const textForActiveRoute = new Map<ActiveRouteId, string>([
  [ActiveRouteId.URL, 'url'],
  [ActiveRouteId.QUERY_PARAMS, 'Query params']
]);

export const sourceForStep = new Map<string, ItemSource>([
  [StepType.HTTP_REQUEST, ItemSource.HTTP],
  [StepType.CUSTOM_CODE, ItemSource.CUSTOM_CODE],
  [StepType.CUSTOM_ASYNC_CODE, ItemSource.CUSTOM_ASYNC_CODE],
  [ItemSource.EVENT, ItemSource.EVENT]
]);

interface BaseUsedValue {
  id: string;
  path?: string;
}

export const enum ItemSourceType {
  PARAM = 'param',
  PREVIOUS_SUCCESS = 'previousSuccess',
  PREVIOUS_ERROR = 'previousError',
  UI = 'ui',
  LOCAL_STORAGE = 'localStorage',
  APP = 'app',
  PAGE = 'page',
  ACTIVE_ROUTE = 'activeRoute',
  LIST_ITEM = 'list-item',
  LIST_ITEM_INDEX = 'list-item-index',
}

export const enum ItemSource {
  APP = 'app',
  UI = 'ui',
  LOCAL_STORAGE = 'localStorage',
  HTTP = 'http',
  HTTP_ERROR = 'httpError',
  EVENT = 'event',
  CUSTOM_CODE = 'customCode',
  CUSTOM_ASYNC_CODE = 'customAsyncCode',
  PAGE = 'page',
  ACTIVE_ROUTE = 'activeRoute',
  LIST_ITEM = 'list-item',
  LIST_ITEM_INDEX = 'list-item-index',
  EXECUTED_ACTION = 'executedActionResult',
}

export const GROUP_TEXT = new Map<ItemSource, string>([
  [ItemSource.APP, 'workbench:State'],
  [ItemSource.UI, 'workbench:UI'],
  [ItemSource.LOCAL_STORAGE, 'workbench:Local Storage'],
  [ItemSource.HTTP, 'workbench:HTTP Request'],
  [ItemSource.EVENT, 'workbench:Event'],
  [ItemSource.CUSTOM_CODE, 'workbench:Code'],
  [ItemSource.CUSTOM_ASYNC_CODE, 'workbench:AsyncCode'],
  [ItemSource.PAGE, 'workbench:Project pages'],
  [ItemSource.ACTIVE_ROUTE, 'workbench:Active page'],
  [ItemSource.LIST_ITEM, 'workbench:Sequence'],
  [ItemSource.LIST_ITEM_INDEX, 'workbench:Sequence'],
  [ItemSource.EXECUTED_ACTION, 'workbench:Action']
]);

export const SOURCE_ICON = new Map<ItemSource, string>([
  [ItemSource.APP, 'workbench:workflow-save-step'],
  [ItemSource.UI, 'workbench:workflow-sidebar-step'],
  [ItemSource.LOCAL_STORAGE, 'workbench:workflow-save-local-step'],
  [ItemSource.HTTP, 'workbench:workflow-http-step'],
  [ItemSource.HTTP_ERROR, 'workbench:workflow-http-step'],
  [ItemSource.CUSTOM_CODE, 'workbench:workflow-code-step'],
  [ItemSource.CUSTOM_ASYNC_CODE, 'workbench:workflow-code-step'],
  [ItemSource.PAGE, 'workbench:workflow-navigation-step'],
  [ItemSource.ACTIVE_ROUTE, 'workbench:workflow-navigation-step'],
  [ItemSource.LIST_ITEM, 'workbench:workflow-sequence'],
  [ItemSource.LIST_ITEM_INDEX, 'workbench:workflow-sequence'],
  [ItemSource.EXECUTED_ACTION, 'workbench:workflow-execute-action-step']
]);

export type StoreItemUsage = BaseUsedValue & { storeItemId: string };
export type ComponentUsage = BaseUsedValue & { componentId: string };
export type LocalStorageItemUsage = BaseUsedValue & { localStorageItemId: string };
export type PreviousStepResultUsage = BaseUsedValue & { previous: true };
export type PreviousErrorStepResultUsage = PreviousStepResultUsage & { error: true };
export type PageUsage = BaseUsedValue & { pageTitle: string };
export type ActiveRouteUsage = BaseUsedValue & { activeRouteId: ActiveRouteId };
export type ListItemUsage = ComponentUsage & { type: 'list-item' | 'list-item-index' };

export type CodeEditorUsedValue =
  | StoreItemUsage
  | LocalStorageItemUsage
  | PreviousStepResultUsage
  | PageUsage
  | ActiveRouteUsage
  | ListItemUsage
  | ComponentUsage;

@Injectable()
export class CodeEditorUsedValuesService {
  copy(usedValue: CodeEditorUsedValue): CodeEditorUsedValue {
    return { ...usedValue, id: nextId() };
  }

  createUsedValueFromOption(selected: SelectorOption): CodeEditorUsedValue {
    switch (selected.sourceType) {
      case ItemSourceType.PREVIOUS_ERROR:
      case ItemSourceType.PARAM:
      case ItemSourceType.PREVIOUS_SUCCESS:
        return this.fromPreviousStepResult(selected);
      case ItemSourceType.PAGE:
        return this.fromPage(selected);
      case ItemSourceType.ACTIVE_ROUTE:
        return this.fromActiveRoute(selected.id as ActiveRouteId);
      case ItemSourceType.LOCAL_STORAGE:
        return this.fromLocalStorageItem(selected);
      case ItemSourceType.UI:
        return this.fromComponent(selected);
      case ItemSourceType.LIST_ITEM:
        return this.fromListItem(selected);
      case ItemSourceType.LIST_ITEM_INDEX:
        return this.fromListItemIndex(selected);
      default:
        return this.fromStoreItem(selected);
    }
  }

  private fromStoreItem(option: SelectorOption): StoreItemUsage {
    return { id: `state.${option.name}`, storeItemId: option.id };
  }

  private fromComponent(option: SelectorOption): ComponentUsage {
    return { id: `ui.${option.id}`, componentId: option.id };
  }

  private fromLocalStorageItem(option: SelectorOption) {
    let name = option.name;
    if (new RegExp(COMMON_VARIABLE_NAME_PATTERN).test(name)) {
      name = `.${name}`;
    } else {
      name = `['${name}']`;
    }
    return { id: `localStorage${name}`, localStorageItemId: option.id };
  }

  private fromPreviousStepResult(option: SelectorOption): PreviousStepResultUsage {
    return { id: option.id, previous: true };
  }

  private fromPage(option: SelectorOption): PageUsage {
    const name = camelize(option.id);
    return { id: `routes.${name}.url`, pageTitle: option.id };
  }

  private fromActiveRoute(activeRouteId: ActiveRouteId): ActiveRouteUsage {
    let path = '';
    if (activeRouteId === ActiveRouteId.URL) {
      path = '.url';
    }
    if (activeRouteId === ActiveRouteId.QUERY_PARAMS) {
      path = '.queryParams';
    }
    return { activeRouteId, id: `activeRoute${path}` };
  }

  // TODO id should used from SequenceProperty
  private fromListItem(option: SelectorOption): ListItemUsage {
    return { componentId: option.id, id: option.name, type: 'list-item' };
  }

  // TODO id should used from SequenceProperty
  private fromListItemIndex(option: SelectorOption): ListItemUsage {
    return { componentId: option.id, id: option.name, type: 'list-item-index' };
  }
}
