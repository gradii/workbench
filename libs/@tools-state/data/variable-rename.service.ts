import { Injectable } from '@angular/core';
import {
  componentsProperties, ConditionParameterType, DataField, dataFields, defaultDataFields, extendDeepValue, getDeepValue,
  HttpRequestParameterType, NavigationParameterType, ParameterValueType, Workflow, WorkflowStep, WorkflowStepParameter
} from '@common/public-api';
import { Action } from '@ngneat/effects/lib/actions.types';

import { ComponentActions } from '@tools-state/component/component.actions';
import { PuffComponent } from '@tools-state/component/component.model';
import { getComponentById, getComponentList } from '@tools-state/component/component.selectors';
import { getWorkflowList } from '@tools-state/data/workflow/workflow.selectors';
import { Page } from '@tools-state/page/page.model';
import { getPageById } from '@tools-state/page/page.selectors';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { WorkflowActions } from './workflow/workflow.actions';

interface RenameInfo {
  oldName: string;
  newName: string;
  namespace: 'state' | 'ui' | 'routes';
}

@Injectable({ providedIn: 'root' })
export class VariableRenameService {
  constructor() {
  }

  getRenameActionsIfNeeded(update: Partial<PuffComponent>): Observable<Action[]> {
    return getComponentById(String(update.id)).pipe(
      take(1),
      switchMap((oldComponent: PuffComponent) => {
        const oldName = oldComponent.properties.name;
        if (update.properties && oldName !== update.properties.name) {
          return this.rename(oldName, update.properties.name, 'ui');
        }
        return of([]);
      })
    );
  }

  getRenameActionsForSmartTableIfNeeded(update: Partial<PuffComponent>): Observable<Action[]> {
    return getComponentById(String(update.id)).pipe(
      take(1),
      switchMap((oldComponent: PuffComponent) => {
        const DEFAULT_RETURN = of([]);
        if (
          oldComponent.definitionId !== 'smartTable' ||
          !update.properties?.settings ||
          !oldComponent.properties?.settings
        ) {
          return DEFAULT_RETURN;
        }

        const changedColumns: string[] = Object.keys(update.properties.settings.columns);
        const oldColumns: string[]     = Object.keys(oldComponent.properties.settings.columns);

        if (
          JSON.stringify(changedColumns) === JSON.stringify(oldColumns) ||
          changedColumns.length !== oldColumns.length
        ) {
          return DEFAULT_RETURN;
        }

        const changedColumnIndex = oldColumns.findIndex(oldKey => {
          return !changedColumns.includes(oldKey);
        });

        if (changedColumnIndex === -1) {
          return DEFAULT_RETURN;
        }

        const smartTablePropertyNames = componentsProperties
          .find(([name]) => name === 'smartTable')[1]
          .map(({ name }) => name);

        const oldNames      = [];
        const newNames      = [];
        const componentName = oldComponent.properties.name;

        for (const smartTablePropertyName of smartTablePropertyNames) {
          oldNames.push(`${componentName}.${smartTablePropertyName}.${oldColumns[changedColumnIndex]}`);
          newNames.push(`${componentName}.${smartTablePropertyName}.${changedColumns[changedColumnIndex]}`);
        }

        return this.renameList(oldNames, newNames, 'ui');
      })
    );
  }

  getRenameActionsIfNeededForRoutes(update: Partial<Page>): Observable<Action[]> {
    return getPageById(update.id).pipe(
      take(1),
      switchMap((oldPage: Page) => {
        const oldName = oldPage.name;
        if (update.name && oldName !== update.name) {
          return this.rename(oldName, update.name, 'routes');
        }
        return of([]);
      })
    );
  }

  rename(oldName: string, newName: string, namespace: 'state' | 'ui' | 'routes'): Observable<Action[]> {
    if (oldName === newName || !newName) {
      return of([]);
    }
    const renameInfo = { oldName, newName, namespace };
    return combineLatest([getComponentList, getWorkflowList]).pipe(
      take(1),
      map(([componentList, workflowList]: [PuffComponent[], Workflow[]]) => {
        return [
          ComponentActions.UpdateComponentList(this.getComponentListUpdates(componentList, renameInfo)),
          WorkflowActions.UpdateWorkflowList(this.getWorkflowListRename(workflowList, renameInfo))
        ];
      })
    );
  }

  renameList(oldNames: string[], newNames: string[], namespace: 'state' | 'ui' | 'routes'): Observable<Action[]> {
    return combineLatest([getComponentList, getWorkflowList]).pipe(
      take(1),
      map(([componentList, workflowList]: [PuffComponent[], Workflow[]]) => {
        const actions = [];

        for (let i = 0; i < oldNames.length; i++) {
          if (oldNames[i] === newNames[i] || !newNames[i]) {
            continue;
          }
          const renameInfo = { oldName: oldNames[i], newName: newNames[i], namespace };
          actions.push(
            ComponentActions.UpdateComponentList(this.getComponentListUpdates(componentList, renameInfo)),
            WorkflowActions.UpdateWorkflowList(this.getWorkflowListRename(workflowList, renameInfo))
          );
        }

        return actions;
      })
    );
  }

  private getComponentListUpdates(componentList: PuffComponent[],
                                  renameInfo: RenameInfo): Partial<PuffComponent>[] {
    const updates: Partial<PuffComponent>[] = [];
    for (const component of componentList) {
      let upd: Partial<PuffComponent> = null;
      upd                               = this.getComponentUpdate(component, renameInfo);
      if (upd) {
        updates.push(upd);
      }
    }

    return updates;
  }

  private getComponentUpdate(component: PuffComponent, renameInfo: RenameInfo) {
    const fieldsToCheck: DataField[]                 = this.getComponentFieldsToCheck(component);
    const updates: { path: string; value: string }[] = [];
    for (const field of fieldsToCheck) {
      if (field.propName) {
        const update = this.getComponentPropertyUpdate(component, field, renameInfo);
        if (update) {
          updates.push(update);
        }
      } else {
        const styleUpdates = this.getComponentStyleUpdate(component, field, renameInfo);
        updates.push(...styleUpdates);
      }
    }

    Object.keys(component.actions || []).forEach(key => {
      const actionUpdates = this.getComponentActionUpdate(component, key, renameInfo);
      updates.push(...actionUpdates);
    });

    if (!updates.length) {
      return null;
    }
    let changes = {
      styles    : { ...component.styles },
      properties: { ...component.properties },
      actions   : { ...component.actions }
    };
    for (const update of updates) {
      changes = extendDeepValue(changes, update.path, update.value);
    }
    return { id: component.id, changes };
  }

  private getComponentActionUpdate(component: PuffComponent, actionName: string, renameInfo: RenameInfo) {
    const updates: { path: string; value: string }[] = [];
    const value                                      = getDeepValue(component.actions, actionName);

    for (let i = 0; i < value.length; i++) {
      const action       = value[i];
      const newParamCode = this.renameVarInString(action.paramCode, renameInfo);
      if (newParamCode !== action.paramCode) {
        updates.push({ path: `actions.${actionName}.${i}.paramCode`, value: newParamCode });
      }
    }
    return updates;
  }

  private getComponentPropertyUpdate(component: PuffComponent, field: DataField, renameInfo: RenameInfo) {
    const value    = getDeepValue(component.properties, field.propName);
    const newValue = this.renameVarInString(value, renameInfo);
    if (value !== newValue) {
      return { path: `properties.${field.propName}`, value: newValue };
    }
    return null;
  }

  private getComponentStyleUpdate(component: PuffComponent, field: DataField, renameInfo: RenameInfo) {
    const updates: { path: string; value: string }[] = [];
    for (const breakpoint of Object.keys(component.styles)) {
      const styleAtBreakPoint = getDeepValue(component.styles[breakpoint], field.styleName);
      const newValue          = this.renameVarInString(styleAtBreakPoint, renameInfo);
      if (styleAtBreakPoint !== newValue) {
        updates.push({ path: `styles.${breakpoint}.${field.styleName}`, value: newValue });
      }
    }
    return updates;
  }

  private renameVarInString(str: string, renameInfo: RenameInfo) {
    if (!str || typeof str !== 'string') {
      return str;
    }

    const containInterpolation = /{{([^}]*)}}/gm.test(str);
    if (!containInterpolation) {
      return str;
    }

    const regex = new RegExp(`${renameInfo.namespace}\\.${renameInfo.oldName}(?!\\w+)`, 'gm');
    return str.replace(regex, `${renameInfo.namespace}.${renameInfo.newName}`);
  }

  private getWorkflowListRename(workflowList: Workflow[], renameInfo: RenameInfo) {
    const updates: Partial<Workflow>[] = [];
    for (const workflow of workflowList) {
      const upd: Partial<Workflow> = this.getWorkflowUpdate(workflow, renameInfo);
      if (upd) {
        updates.push(upd);
      }
    }
    return updates;
  }

  private getWorkflowUpdate(workflow: Workflow, renameInfo: RenameInfo) {
    const [steps, hasChanges] = this.updateSteps(workflow.steps, renameInfo);
    return hasChanges ? { id: workflow.id, changes: { steps } } : null;
  }

  private updateSteps(steps: WorkflowStep[], renameInfo: RenameInfo): [WorkflowStep[], boolean] {
    let hasChanges = false;
    const newSteps = steps.map(step => {
      const newParams = step.params.map((param: WorkflowStepParameter) => {
        if (param.type === ConditionParameterType.STEPS) {
          const newParamValue = (param.value as { condition: boolean; steps: WorkflowStep[] }[]).map(value => {
            const [updatedSteps, changes] = this.updateSteps(value.steps, renameInfo);
            if (changes) {
              hasChanges = true;
            }
            return { ...value, steps: updatedSteps };
          });

          return { ...param, value: newParamValue };
        }

        const updatedParam = this.processWorkflowParam(param, renameInfo);
        if (updatedParam) {
          hasChanges = true;
          return updatedParam;
        }

        return param;
      });

      return { ...step, params: newParams };
    });

    return [newSteps, hasChanges];
  }

  private processWorkflowParam(param: WorkflowStepParameter, renameInfo: RenameInfo) {
    if (param.valueType === ParameterValueType.INTERPOLATED_VALUE) {
      const newValue = this.renameVarInString(param.value, renameInfo);
      if (newValue !== param.value) {
        return { ...param, value: newValue };
      }
    }

    const isHttpSubParam =
            param.type === HttpRequestParameterType.HEADERS ||
            param.type === HttpRequestParameterType.QUERY_PARAMS ||
            param.type === NavigationParameterType.QUERY_PARAMS;

    if (isHttpSubParam) {
      let hasChanges = false;
      const newValue = param.value.map((subParam: { name: string; value: string }) => {
        const newSubValue = this.renameVarInString(subParam.value, renameInfo);
        if (newSubValue !== subParam.value) {
          hasChanges = true;
          subParam   = { ...subParam, value: newSubValue };
        }
        return subParam;
      });
      if (hasChanges) {
        return { ...param, value: newValue };
      }
    }

    return null;
  }

  private getComponentFieldsToCheck(component: PuffComponent): DataField[] {
    const fieldsToCheck: DataField[] = [...defaultDataFields];
    const componentFields            = dataFields[component.definitionId];
    if (componentFields) {
      fieldsToCheck.push(...componentFields);
    }
    return fieldsToCheck;
  }
}
