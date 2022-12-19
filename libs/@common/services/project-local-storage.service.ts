import { Inject, Injectable } from '@angular/core';

import { LocalStorageItem } from '../models/data.models';

const WORKFLOW_LS_PREFIX = '@devops-tools/workflow-ls';

@Injectable({ providedIn: 'root' })
export class ProjectLocalStorageService {
  constructor() {
    this.initLocalStorage();
  }

  getItem(name: string, projectId: string): LocalStorageItem {
    const workflowItemsConfig: Object = this.getLocalStorageState();
    if (!workflowItemsConfig[projectId]) {
      return null;
    }
    const value = workflowItemsConfig[projectId][name];

    return { name, value: null, valueInLocalStorage: value };
  }

  saveItem(item: LocalStorageItem, projectId: string): void {
    const { name, value } = item;
    const workflowItemsState: Object = this.getLocalStorageState();

    if (!workflowItemsState[projectId]) {
      workflowItemsState[projectId] = {};
    }
    workflowItemsState[projectId][name] = value;

   window.localStorage.setItem(WORKFLOW_LS_PREFIX, JSON.stringify(workflowItemsState));
  }

  private getLocalStorageState(): Object {
    const workflowItems: string = window.localStorage.getItem(WORKFLOW_LS_PREFIX);
    return JSON.parse(workflowItems);
  }

  private initLocalStorage() {
    const ls = window.localStorage;
    if (ls.getItem(WORKFLOW_LS_PREFIX) === null) {
      ls.setItem(WORKFLOW_LS_PREFIX, '{}');
    }
  }
}
