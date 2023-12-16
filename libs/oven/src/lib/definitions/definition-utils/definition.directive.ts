import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[ovenDefinition]' })
export class DefinitionDirective<T> {
  constructor(public template: TemplateRef<T>) {
  }
}
