import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, nextComponentId } from '@common';
import { NbIconComponent, NbIconModule, NbTooltipModule } from '@nebular/theme';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { IconDefinitionComponent, IconDefinitionDirective } from './icon-definition';
import { DefinitionUtilsModule } from '../../definition-utils';

export function iconFactory() {
  return {
    id: nextComponentId(),
    definitionId: 'icon',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size: {
          custom: false,
          customValue: 1.25,
          customUnit: 'rem',
          predefinedValue: '' // tiny, small ...
        },
        color: 'basic'
      }
    },
    properties: {
      icon: 'star-outline',
      tooltip: '',
      name: 'Icon'
    }
  };
}

const iconDefinition: Definition = {
  id: 'icon',
  componentType: NbIconComponent,
  definition: IconDefinitionComponent,
  factory: iconFactory
};

const iconMetaDefinition: MetaDefinition = {
  definition: iconDefinition,
  name: 'Icon',
  icon: 'icon',
  order: 600,
  headerSupport: true,
  sidebarSupport: true,
  tags: []
};

@NgModule({
  imports: [DefinitionUtilsModule, CommonModule, NbIconModule, NbTooltipModule],
  exports: [IconDefinitionComponent],
  declarations: [IconDefinitionDirective, IconDefinitionComponent],
  entryComponents: [IconDefinitionComponent],
  providers: [createDefinitionProvider(iconDefinition), createMetaDefinitionProvider(iconMetaDefinition)]
})
export class IconDefinitionModule {
}
