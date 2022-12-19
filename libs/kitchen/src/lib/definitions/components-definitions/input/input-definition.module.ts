import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InputDirective, TriInputModule } from '@gradii/triangle/input';
import { BreakpointWidth, FormFieldWidthType, nextComponentId, KitchenComponent, KitchenType } from '@common/public-api';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { InputDefinitionComponent, InputDefinitionDirective } from './input-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { WorkflowModule } from '../../../workflow/workflow.module';
import { TriIconModule } from '@gradii/triangle/icon';

export function inputFactory(): KitchenComponent {
  return {
    id: nextComponentId(), type: KitchenType.Component,
    definitionId: 'input',
    styles      : {
      [BreakpointWidth.Desktop]: {
        visible: true,
        width  : {
          type       : FormFieldWidthType.AUTO,
          customValue: 220,
          customUnit : 'px'
        },
        size   : 'medium'
      }
    },
    properties  : {
      placeholder  : 'Enter Value',
      type         : 'text',
      status       : 'basic',
      shape        : 'rectangle',
      disabled     : false,
      iconPlacement: 'none',
      icon         : 'star',
      name         : 'Input'
    },
    actions     : {
      type: []
    }
  };
}

const inputDefinition: Definition = {
  id           : 'input',
  componentType: InputDirective,
  definition   : InputDefinitionComponent,
  dataTrigger  : true,
  factory      : inputFactory
};

const inputMetaDefinition: MetaDefinition = {
  definition    : inputDefinition,
  name          : 'Input',
  icon          : 'workbench:input',
  order         : 400,
  headerSupport : true,
  sidebarSupport: true,
  tags          : ['form', 'control']
};

@NgModule({
    imports: [
        CommonModule, TriInputModule, TriIconModule, DefinitionUtilsModule, WorkflowModule, TriIconModule,
        TriInputModule
    ],
    exports: [InputDefinitionComponent],
    declarations: [InputDefinitionDirective, InputDefinitionComponent],
    providers: [
        createDefinitionProvider(inputDefinition),
        createMetaDefinitionProvider(inputMetaDefinition)
    ]
})
export class InputDefinitionModule {
}
