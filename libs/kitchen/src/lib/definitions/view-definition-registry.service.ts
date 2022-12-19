import { Injectable, TemplateRef } from '@angular/core';

function throwNotFoundError(definitionId: string) {
  throw new Error(`Definition for component: ${definitionId} wasn't provided.`);
}

@Injectable({ providedIn: 'root' })
export class ViewDefinitionRegistryService {
  private definitions: Map<string, TemplateRef<any>> = new Map();

  // TODO rethink template ref any
  set<T>(definitionId: string, definition: TemplateRef<any>) {
    this.definitions.set(definitionId, definition);
  }

  // TODO rethink template ref any
  get<T>(definitionId: string): TemplateRef<any> {
    if (!this.definitions.has(definitionId)) {
      throwNotFoundError(definitionId);
    }

    return this.definitions.get(definitionId);
  }
}
