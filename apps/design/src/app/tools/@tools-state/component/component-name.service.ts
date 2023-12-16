import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { getUniqueName } from '@common';

import { BakeryComponent } from '@tools-state/component/component.model';
import { getComponentList } from '@tools-state/component/component.selectors';
import { fromTools } from '@tools-state/tools.reducer';

@Injectable({ providedIn: 'root' })
export class ComponentNameService {
  constructor(private store: Store<fromTools.State>) {
  }

  addComponentIndexIfNeeded(componentList: BakeryComponent[]): Observable<BakeryComponent[]> {
    return this.store.pipe(
      select(getComponentList),
      take(1),
      map((containerList: BakeryComponent[]) => this.findComponentName(componentList, containerList))
    );
  }

  findComponentName(componentList: BakeryComponent[], containerList: BakeryComponent[]) {
    return componentList.map((component: BakeryComponent) => {
      const name = this.getComponentName(containerList, component.properties.name);
      const updatedComponent = {
        ...component,
        properties: { ...component.properties, container: component.properties.container, name }
      };
      containerList = [updatedComponent, ...containerList];
      return updatedComponent;
    });
  }

  private getComponentName(componentList: BakeryComponent[], name: string): string {
    const takenNames: string[] = componentList.map((comp: BakeryComponent) => comp.properties.name);
    return getUniqueName(takenNames, name);
  }
}
