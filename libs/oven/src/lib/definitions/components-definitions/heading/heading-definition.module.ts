import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreakpointWidth, nextComponentId } from '@common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { stringValidator } from '../../definition-utils/data-validators';
import { HeadingDefinitionComponent, HeadingDefinitionDirective } from './heading-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { WorkflowModule } from '../../../workflow/workflow.module';

export function headingFactory(text = 'Text Heading', type = 'h1') {
  return {
    id: nextComponentId(),
    definitionId: 'heading',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        color: 'basic'
      }
    },
    properties: {
      text,
      type,
      italic: false,
      alignment: 'left',
      transform: 'none',
      name: 'Heading'
    }
  };
}

const headingDefinition: Definition = {
  id: 'heading',
  componentType: null,
  dataConsumer: true,
  dataValidator: stringValidator,
  definition: HeadingDefinitionComponent,
  factory: headingFactory
};

const headingMetaDefinition: MetaDefinition = {
  definition: headingDefinition,
  name: 'Heading',
  icon: 'heading',
  order: 550,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['text', 'header', 'title']
};

@NgModule({
  imports: [DefinitionUtilsModule, CommonModule, FormsModule, WorkflowModule],
  exports: [HeadingDefinitionComponent],
  declarations: [HeadingDefinitionDirective, HeadingDefinitionComponent],
  entryComponents: [HeadingDefinitionComponent],
  providers: [createDefinitionProvider(headingDefinition), createMetaDefinitionProvider(headingMetaDefinition)]
})
export class HeadingDefinitionModule {
}
