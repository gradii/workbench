import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';

import { Definition } from './definition';
import { ViewDefinitionRegistryService } from './view-definition-registry.service';
import { ComponentDefinition } from './definition-utils';

@Injectable({ providedIn: 'root' })
export class ViewDefinitionsService {
  private host: ViewContainerRef;

  constructor(
    private viewDefinitionRegistry: ViewDefinitionRegistryService,
  ) {
  }

  attach(host: ViewContainerRef) {
    this.host = host;
  }

  define(definition: Definition) {
    if (!this.host) {
      throw new Error('You need to attach DefinitionsService to the ViewContainerRef first.');
    }

    const definitionRef: ComponentRef<any> = this.renderDefinition(definition);
    this.defineComponent(definition, definitionRef);
  }

  defineAll(definitionList: Definition[]) {
    for (const definition of definitionList) {
      this.define(definition);
    }
  }

  private renderDefinition(definition: Definition): ComponentRef<any> {
    const definitionRef = this.host.createComponent(definition.definition);
    definitionRef.changeDetectorRef.detectChanges();

    return definitionRef;
  }

  private defineComponent(definition: Definition, definitionRef: ComponentRef<ComponentDefinition<any>>) {
    this.viewDefinitionRegistry.set(definition.id, definitionRef.instance.definition.template);
  }
}
