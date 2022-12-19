import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, KitchenType, nextComponentId } from '@common/public-api';
import { TriMenuModule } from '@gradii/triangle/menu';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { MenuDefinitionComponent, MenuDefinitionDirective } from './menu-definition';
import { DefinitionUtilsModule } from '../../definition-utils';

export function menuFactory() {
  return {
    id          : nextComponentId(),
    type        : KitchenType.Component,
    definitionId: 'menu',
    styles      : {
      [BreakpointWidth.Desktop]: {
        size   : {
          widthValue: 100,
          widthUnit : '%',
          widthAuto : false,
          heightAuto: true
        },
        visible: true
      }
    },
    properties  : {
      items: [],
      name : 'Menu',
      color: 'basic'
    }
  };
}

const menuDefinition: Definition = {
  id           : 'menu',
  componentType: null,
  definition   : MenuDefinitionComponent,
  factory      : menuFactory
};

const menuMetaDefinition: MetaDefinition = {
  definition    : menuDefinition,
  name          : 'Menu',
  icon          : 'workbench:menu-component',
  order         : 650,
  headerSupport : false,
  sidebarSupport: true,
  tags          : ['menu', 'navigation']
};

@NgModule({
    imports: [DefinitionUtilsModule, CommonModule, TriMenuModule],
    exports: [MenuDefinitionComponent],
    declarations: [MenuDefinitionDirective, MenuDefinitionComponent],
    providers: [
        createDefinitionProvider(menuDefinition),
        createMetaDefinitionProvider(menuMetaDefinition)
    ]
})
export class MenuDefinitionModule {
}
