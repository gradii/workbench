import { Injectable } from '@angular/core';
import { BakeryApp } from '@tools-state/app/app.model';
import { BakeryComponent } from '@tools-state/component/component.model';
import { ComponentChange } from '../app-changes';

@Injectable()
export class FieldsConfiguratorService {
  public updateValue(component: BakeryComponent, properties: string, index: number): ComponentChange[] {
    return [
      {
        index: index,
        id: component.id,
        definitionId: component.definitionId,
        properties: {
          [properties]: component.properties[properties]
        }
      }
    ];
  }

  public updateStyle(component: BakeryComponent, styles: string, index: number): ComponentChange[] {
    return [
      {
        index: index,
        id: component.id,
        definitionId: component.definitionId,
        styles: {
          xl: {
            [styles]: component.styles.xl[styles]
          }
        }
      }
    ];
  }

  public getComponents(app: BakeryApp, definitionId: string, notId?: string): BakeryComponent[] {
    return app.componentList.filter(
      (component: BakeryComponent) => component.definitionId === definitionId && (!notId || component.id !== notId)
    );
  }
}
