import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreakpointWidth, nextComponentId } from '@common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { stringValidator } from '../../definition-utils/data-validators';
import { LinkDefinitionComponent, LinkDefinitionDirective } from './link-definition';
import { DefinitionUtilsModule } from '../../definition-utils';

export function linkFactory() {
  return {
    id: nextComponentId(),
    definitionId: 'link',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        color: 'primary'
      }
    },
    properties: {
      text: 'Text Link',
      italic: false,
      bold: false,
      decoration: 'underline',
      alignment: 'left',
      transform: 'none',
      name: 'Link',
      url: {
        path: '',
        external: true
      }
    }
  };
}

const linkDefinition: Definition = {
  id: 'link',
  componentType: null,
  dataConsumer: true,
  dataValidator: stringValidator,
  definition: LinkDefinitionComponent,
  factory: linkFactory
};

const linkMetaDefinition: MetaDefinition = {
  definition: linkDefinition,
  name: 'Link',
  icon: 'link-component',
  order: 900,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['navigation']
};

@NgModule({
  imports: [DefinitionUtilsModule, CommonModule, FormsModule],
  exports: [LinkDefinitionComponent],
  declarations: [LinkDefinitionDirective, LinkDefinitionComponent],
  entryComponents: [LinkDefinitionComponent],
  providers: [createDefinitionProvider(linkDefinition), createMetaDefinitionProvider(linkMetaDefinition)]
})
export class LinkDefinitionModule {
}
