import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  BreakpointWidth, FormFieldWidthType, KitchenComponent, KitchenType, nextComponentId
} from '@common/public-api';
import { ButtonComponent, TriButtonModule } from '@gradii/triangle/button';
import { TriDndModule } from '@gradii/triangle/dnd';
import { TriIconModule } from '@gradii/triangle/icon';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { ButtonDefinitionComponent, ButtonDefinitionDirective } from './button-definition';

export function buttonFactory(): KitchenComponent {
  return {
    id          : nextComponentId(),
    type        : KitchenType.Component,
    definitionId: 'button',
    styles      : {
      [BreakpointWidth.Desktop]: {
        visible      : true,
        size         : 'medium',
        width        : {
          type       : FormFieldWidthType.AUTO,
          customValue: 220,
          customUnit : 'px'
        },
        iconPlacement: 'none'
      }
    },
    properties  : {
      text    : 'Button',
      color   : 'primary',
      variant : 'fill',
      disabled: false,
      icon    : 'star',
      name    : 'Button'
    },
    actions     : {
      click: []
    }
  };
}

const buttonDefinition: Definition = {
  id           : 'button',
  componentType: ButtonComponent,
  definition   : ButtonDefinitionComponent,
  dataTrigger  : true,
  factory      : buttonFactory
};

const buttonMetaDefinition: MetaDefinition = {
  definition    : buttonDefinition,
  name          : 'Button',
  icon          : 'workbench:button',
  order         : 200,
  headerSupport : true,
  sidebarSupport: true,
  tags          : ['form', 'control']
};

@NgModule({
  imports     : [TriButtonModule, TriIconModule, DefinitionUtilsModule, CommonModule, TriDndModule],
  exports     : [ButtonDefinitionComponent],
  declarations: [ButtonDefinitionDirective, ButtonDefinitionComponent],
  providers   : [createDefinitionProvider(buttonDefinition), createMetaDefinitionProvider(buttonMetaDefinition)]
})
export class ButtonDefinitionModule {
}
