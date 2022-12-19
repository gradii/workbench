import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreakpointWidth, nextComponentId, KitchenComponent, KitchenType } from '@common/public-api';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { stringValidator } from '../../definition-utils/data-validators';
import { TextDefinitionComponent, TextDefinitionDirective } from './text-definition';
import { DefinitionUtilsModule } from '../../definition-utils';

export function textFactory(text?: string, type = 'paragraph'): KitchenComponent {
  return {
    id: nextComponentId(),type: KitchenType.Component,
    definitionId: 'text',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        color: 'basic'
      }
    },
    properties: {
      name: 'Text',
      text: text || `New Text`,
      type,
      italic: false,
      bold: false,
      alignment: 'left',
      transform: 'none'
    }
  };
}

const textDefinition: Definition = {
  id: 'text',
  componentType: null,
  dataConsumer: true,
  dataValidator: stringValidator,
  definition: TextDefinitionComponent,
  factory: textFactory
};

const textMetaDefinition: MetaDefinition = {
  definition: textDefinition,
  name: 'Text',
  icon: 'workbench:text',
  order: 500,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['label', 'paragraph', 'p', 'caption', 'span']
};

@NgModule({
    imports: [CommonModule, DefinitionUtilsModule, FormsModule],
    exports: [TextDefinitionComponent],
    declarations: [TextDefinitionDirective, TextDefinitionComponent],
    providers: [createDefinitionProvider(textDefinition), createMetaDefinitionProvider(textMetaDefinition)]
})
export class TextDefinitionModule {
}
