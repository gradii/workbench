import { Inject, Pipe, PipeTransform } from '@angular/core';
import { KitchenComponent } from '@common/public-api';

import { COMPONENT_META_DEFINITION, MetaDefinition } from '../../../definitions/definition';

@Pipe({ name: 'kitchenComponentName' })
export class KitchenComponentName implements PipeTransform {
  constructor(@Inject(COMPONENT_META_DEFINITION) private definitions: MetaDefinition[]) {
  }

  transform(kitchenComponent: KitchenComponent): string {
    const meta: MetaDefinition = this.definitions.find(m => m.definition.id === kitchenComponent.definitionId);
    if (!meta) {
      const name: string = kitchenComponent.definitionId;
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return meta.name;
  }
}
