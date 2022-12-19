import { Inject, Injectable } from '@angular/core';

import { COMPONENT_DEFINITION, COMPONENT_META_DEFINITION, Definition, MetaDefinition } from './definition';

@Injectable({ providedIn: 'root' })
export class DefinitionsService {
  constructor(
    // @Inject(COMPONENT_DEFINITION) private definitions: Definition[],
    // @Inject(COMPONENT_META_DEFINITION) private metaDefinitions: MetaDefinition[]
  ) {
  }

  getDefinition(definitionId: string): Definition {
    return null
    // return this.definitions.find((d: Definition) => d.id === definitionId);
  }

  getMetaDefinition(definitionId: string): MetaDefinition {
    return null
    // return this.metaDefinitions.find((d: MetaDefinition) => d.definition.id === definitionId);
  }
}
