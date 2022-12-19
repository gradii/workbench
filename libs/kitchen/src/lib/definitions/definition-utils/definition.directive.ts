import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[kitchenDefinition]' })
export class DefinitionDirective<T> {

  constructor(public template: TemplateRef<T>) {
  }
}
