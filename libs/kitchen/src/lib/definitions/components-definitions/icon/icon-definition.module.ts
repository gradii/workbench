import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, KitchenType, nextComponentId } from '@common/public-api';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { IconDefinitionComponent, IconDefinitionDirective } from './icon-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { IconComponent, TriIconModule } from '@gradii/triangle/icon';
import { TriTooltipModule } from '@gradii/triangle/tooltip';

export function iconFactory() {
  return {
    id: nextComponentId(), type: KitchenType.Component,
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
  componentType: IconComponent,
  definition: IconDefinitionComponent,
  factory: iconFactory
};

const iconMetaDefinition: MetaDefinition = {
  definition: iconDefinition,
  name: 'Icon',
  icon: 'workbench:icon',
  order: 600,
  headerSupport: true,
  sidebarSupport: true,
  tags: []
};

@NgModule({
    imports: [DefinitionUtilsModule, CommonModule, TriIconModule, TriTooltipModule],
    exports: [IconDefinitionComponent],
    declarations: [IconDefinitionDirective, IconDefinitionComponent],
    providers: [createDefinitionProvider(iconDefinition), createMetaDefinitionProvider(iconMetaDefinition)]
})
export class IconDefinitionModule {
}
