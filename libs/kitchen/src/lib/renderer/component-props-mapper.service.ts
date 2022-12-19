import { Injectable } from '@angular/core';

import { View } from '../definitions';
import { ComponentPropsMapperRegistry } from './component-props-mapper.registry';
import { ComponentPropsMapper } from '../definitions/definition';

@Injectable(/*{ providedIn: 'root' }*/)
export class ComponentPropsMapperService {
  constructor(private componentPropsMapperRegistry: ComponentPropsMapperRegistry) {
  }

  mapProps<T, D>(view: View<T>, definitionId: string, props: D): void {
    if (this.componentPropsMapperRegistry.has(definitionId)) {
      const propsMapper: ComponentPropsMapper = this.componentPropsMapperRegistry.get(definitionId);
      propsMapper(view.instance, props);
    } else {
      Object.assign(view.instance, props);
    }
  }
}
