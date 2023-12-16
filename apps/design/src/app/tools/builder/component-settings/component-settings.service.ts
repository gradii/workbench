import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { fromTools } from '@tools-state/tools.reducer';
import { getSlotById, getSlotParent } from '@tools-state/slot/slot.selectors';
import { Slot } from '@tools-state/slot/slot.model';
import { BakeryComponent } from '@tools-state/component/component.model';

@Injectable({ providedIn: 'root' })
export class ComponentSettingsService {
  private readonly specialSlotNames: string[] = ['header', 'body', 'footer', 'list'];

  constructor(private store: Store<fromTools.State>) {
  }

  public getComponentIconName(definitionId: string, fullName?: string, active?: boolean): string {
    definitionId = this.camelToSnakeCase(definitionId);
    if (fullName) {
      fullName = fullName.toLowerCase();
    }
    let name = 'component-icon-';
    if (fullName && fullName.includes('card')) {
      name += this.getCardIconName(definitionId, fullName);
    } else {
      name += definitionId;
    }
    return active ? name + '-active' : name;
  }

  public getCardIconName(definitionId: string, fullName: string): string {
    if (fullName.includes('header')) {
      return 'card-header';
    } else if (fullName.includes('body')) {
      return 'card-body';
    } else if (fullName.includes('footer')) {
      return 'card-footer';
    }
    return definitionId;
  }

  public getComponentLabel(parenSlotId: string): Observable<string> {
    return combineLatest([
      this.store.select(getSlotParent, parenSlotId),
      this.store.select(getSlotById, parenSlotId)
    ]).pipe(
      take(1),
      map(([parentComponent, parentSlot]: [BakeryComponent, Slot]) => {
        if (!parentSlot) {
          return '';
        }
        const { name } = parentSlot;
        if (!parentComponent) {
          return '';
        }
        const { definitionId, properties } = parentComponent;
        let index;
        if (definitionId === 'accordion') {
          index = this.getItemIndex(properties['options'], name);
        } else if (definitionId === 'list') {
          index = this.getItemIndex(properties['rows'], name);
        } else if (definitionId === 'tabs') {
          index = this.getItemIndex(properties['options'], name);
        }
        return this.getFullComponentName(name, definitionId, index);
      })
    );
  }

  public getFullComponentName(parentSlotName: string, parentDefinitionId: string, index: number): string {
    let resultName = '';
    if (this.specialSlotNames.includes(parentSlotName)) {
      resultName = parentSlotName + ' Space';
    }
    if (parentDefinitionId === 'card') {
      return 'Card ' + resultName;
    }
    if (parentDefinitionId === 'accordion') {
      return 'Item ' + index + ' Space';
    }
    if (parentDefinitionId === 'list') {
      return 'Item ' + index + ' Space';
    }
    if (parentDefinitionId === 'tabs') {
      return 'tab ' + index + ' Space';
    }
    return resultName;
  }

  private getItemIndex(list: [{ id: string }], id: string): number {
    return list.findIndex(item => item.id === id) + 1 || 0;
  }

  public camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  }

  public splitName(str: string): string {
    return str.replace(/[A-Z]/g, letter => ` ${letter}`);
  }
}
