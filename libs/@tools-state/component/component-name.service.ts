import { Injectable } from '@angular/core';
import { getUniqueName } from '@common/public-api';

import { PuffComponent } from '@tools-state/component/component.model';
import { getComponentList } from '@tools-state/component/component.selectors';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ComponentNameService {
  constructor() {
  }

  addComponentIndexIfNeeded(componentList: PuffComponent[]): Observable<PuffComponent[]> {
    return getComponentList.pipe(
      take(1),
      map((containerList: PuffComponent[]) => this.findComponentName(componentList, containerList))
    );
  }

  findComponentName(componentList: PuffComponent[], containerList: PuffComponent[]) {
    return componentList.map((component: PuffComponent) => {
      const name = this.getComponentName(containerList, component.properties.name);
      const updatedComponent = {
        ...component,
        properties: { ...component.properties, container: component.properties.container, name }
      };
      containerList = [updatedComponent, ...containerList];
      return updatedComponent;
    });
  }

  private getComponentName(componentList: PuffComponent[], name: string): string {
    const takenNames: string[] = componentList.map((comp: PuffComponent) => comp.properties.name);
    return getUniqueName(takenNames, name);
  }
}
