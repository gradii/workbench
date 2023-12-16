import { Inject, Pipe, PipeTransform } from '@angular/core';
import { OvenComponent } from '@common';

import { COMPONENT_META_DEFINITION, MetaDefinition } from '../../../definitions/definition';

@Pipe({ name: 'ovenComponentName' })
export class OvenComponentName implements PipeTransform {
  constructor(@Inject(COMPONENT_META_DEFINITION) private definitions: MetaDefinition[]) {
  }

  transform(ovenComponent: OvenComponent): string {
    const meta: MetaDefinition = this.definitions.find(m => m.definition.id === ovenComponent.definitionId);
    if (!meta) {
      const name: string = ovenComponent.definitionId;
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return meta.name;
  }
}
