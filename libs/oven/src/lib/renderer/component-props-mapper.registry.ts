import { Inject, Injectable } from '@angular/core';

import { COMPONENT_DEFINITION, ComponentPropsMapper, Definition } from '../definitions/definition';

@Injectable({ providedIn: 'root' })
export class ComponentPropsMapperRegistry {
  private registry = new Map<string, ComponentPropsMapper>();

  constructor(@Inject(COMPONENT_DEFINITION) definitions: Definition[]) {
    this.initRegistry(definitions);
  }

  has(definitionId: string): boolean {
    return this.registry.has(definitionId);
  }

  get(definitionId: string): ComponentPropsMapper {
    return this.registry.get(definitionId);
  }

  private initRegistry(definitions: Definition[]): void {
    for (const definition of definitions) {
      if (definition.propsMapper) {
        this.registry.set(definition.id, definition.propsMapper);
      }
    }
  }
}
