import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageItem, StoreItem } from '@common/public-api';
import { camelCase } from '@gradii/pinara/to-case';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { ComponentStateChanges } from './initial-state.service';

export interface AppState {
  // used for updating by id
  storeItemList: StoreItem[];
  userItems: {
    [storeItemName: string]: any;
  };
  localStorage: {
    [itemName: string]: any;
  };
  componentValues: {
    [componentName: string]: { [propName: string]: any };
  };
  routes: {
    [pageName: string]: {
      url: string;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class GlobalStateService {
  private state: BehaviorSubject<AppState> = new BehaviorSubject<AppState>({
    storeItemList: [],
    userItems: {},
    localStorage: {},
    componentValues: {},
    routes: {}
  });

  readonly state$: Observable<AppState> = this.state
    .asObservable()
    .pipe(distinctUntilChanged((prevState: AppState, nextState: AppState) => this.compareStates(prevState, nextState)));

  constructor(private router: Router) {
  }

  updateUserItem(itemId: string, value: any) {
    const currentState: AppState = this.state.getValue();
    const storeItem: StoreItem = currentState.storeItemList.find(item => itemId === item.id);
    const newState = { ...currentState, userItems: { ...currentState.userItems, [storeItem.name]: value } };
    this.state.next(newState);
  }

  updateComponentProperty(componentName: string, property: string, value: any) {
    const currentState: AppState = this.state.getValue();
    const newComponentValue = { ...currentState.componentValues[componentName], [property]: value };
    const newState = {
      ...currentState,
      componentValues: { ...currentState.componentValues, [componentName]: newComponentValue }
    };
    this.state.next(newState);
  }

  updateInitialUserState(storeItemList: StoreItem[]) {
    const currentState: AppState = this.state.getValue();
    const newUserItems = {};
    for (const item of storeItemList) {
      newUserItems[item.name] = item.value;
    }
    this.state.next({ ...currentState, userItems: newUserItems, storeItemList: storeItemList });
  }

  updateInitialComponentState(changes: ComponentStateChanges) {
    const currentState: AppState = this.state.getValue();
    const newComponentState = { ...currentState.componentValues };

    for (const createItem of changes.itemsToCreate) {
      if (newComponentState[createItem.name]) {
        newComponentState[createItem.name][createItem.propName] = createItem.value;
      } else {
        newComponentState[createItem.name] = { [createItem.propName]: createItem.value };
      }
    }

    for (const deleteItem of changes.itemsToDelete) {
      delete newComponentState[deleteItem.name];
    }

    for (const renameItem of changes.itemsToRename) {
      newComponentState[renameItem.newName] = newComponentState[renameItem.oldName];
      delete newComponentState[renameItem.oldName];
    }

    this.state.next({ ...currentState, componentValues: newComponentState });
  }

  setLocalStorageItems(items: LocalStorageItem[]) {
    const currentState: AppState = this.state.getValue();
    let newState = { ...currentState };
    for (const item of items) {
      newState = { ...currentState, localStorage: { ...newState.localStorage, [item.name]: item.valueInLocalStorage } };
    }
    this.state.next(newState);
  }

  setPageMap(pageMap: { [pageName: string]: { url: string } }) {
    const camelCaseMap = {};
    for (const [key, value] of Object.entries(pageMap)) {
      camelCaseMap[camelCase(key)] = value;
    }
    const currentState: AppState = this.state.getValue();
    const newState = { ...currentState, routes: { ...camelCaseMap } };
    this.state.next(newState);
  }

  getActualState(): AppState {
    return this.state.getValue();
  }

  getRouteData(): { url: string; queryParams: { [key: string]: any } } {
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return { url: this.router.url, queryParams: route.snapshot.queryParams };
  }

  private compareStates(prevState: AppState, nextState: AppState): boolean {
    return JSON.stringify(prevState) === JSON.stringify(nextState);
  }
}
