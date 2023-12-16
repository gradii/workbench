import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentProperties, componentsProperties, OutputProperty, StoreItemType } from '@common';

import { OptionGroup, SelectorOption } from '@tools-shared/code-editor/store-item-selector.component';
import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { BakeryComponent } from '@tools-state/component/component.model';
import { GROUP_TEXT, ItemSource, ItemSourceType } from '@tools-shared/code-editor/used-value.service';

const DEFAULT_SCHEME: OutputProperty[] = [
  {
    name: 'value',
    type: StoreItemType.STRING,
    initialValue: ''
  }
];

@Injectable({ providedIn: 'any' })
export class UIOptionGroupResolverService {
  private schemes = new Map<string, ComponentProperties>(componentsProperties);

  constructor(private componentFacade: ComponentFacade) {
  }

  resolveUIOptionGroups(): Observable<OptionGroup[]> {
    return this.componentFacade.dataComponentList$.pipe(
      map((components: BakeryComponent[]) => {
        if (!components.length) {
          return [];
        }
        const options: SelectorOption[] = components.map(component => this.createComponentOptions(component)).flat();

        return [
          {
            itemSource: ItemSource.UI,
            namespace: 'ui',
            name: GROUP_TEXT.get(ItemSource.UI),
            options
          }
        ];
      })
    );
  }

  private createComponentOptions(component: BakeryComponent): SelectorOption[] {
    const componentScheme: ComponentProperties = this.resolveComponentScheme(component.definitionId);
    return componentScheme.map((property: OutputProperty) => this.createComponentOption(component, property));
  }

  private createComponentOption(component: BakeryComponent, property: OutputProperty): SelectorOption {
    return {
      id: component.properties.name,
      name: component.properties.name,
      sourceType: ItemSourceType.UI,
      valueType: property.type,
      value: '',
      path: property.name
    };
  }

  private resolveComponentScheme(definitionId: string): ComponentProperties {
    if (this.schemes.has(definitionId)) {
      return this.schemes.get(definitionId);
    }

    return DEFAULT_SCHEME;
  }
}
