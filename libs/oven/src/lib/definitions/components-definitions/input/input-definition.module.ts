import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbFormFieldModule, NbIconModule, NbInputDirective, NbInputModule } from '@nebular/theme';
import { BreakpointWidth, FormFieldWidthType, nextComponentId, OvenComponent } from '@common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { InputDefinitionComponent, InputDefinitionDirective } from './input-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { WorkflowModule } from '../../../workflow/workflow.module';

export function inputFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'input',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        width: {
          type: FormFieldWidthType.AUTO,
          customValue: 220,
          customUnit: 'px'
        },
        size: 'medium'
      }
    },
    properties: {
      placeholder: 'Enter Value',
      type: 'text',
      status: 'basic',
      shape: 'rectangle',
      disabled: false,
      iconPlacement: 'none',
      icon: 'star',
      name: 'Input'
    },
    actions: {
      type: []
    }
  };
}

const inputDefinition: Definition = {
  id: 'input',
  componentType: NbInputDirective,
  definition: InputDefinitionComponent,
  dataTrigger: true,
  factory: inputFactory
};

const inputMetaDefinition: MetaDefinition = {
  definition: inputDefinition,
  name: 'Input',
  icon: 'input',
  order: 400,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['form', 'control']
};

@NgModule({
  imports: [CommonModule, NbInputModule, NbFormFieldModule, NbIconModule, DefinitionUtilsModule, WorkflowModule],
  exports: [InputDefinitionComponent],
  declarations: [InputDefinitionDirective, InputDefinitionComponent],
  entryComponents: [InputDefinitionComponent],
  providers: [createDefinitionProvider(inputDefinition), createMetaDefinitionProvider(inputMetaDefinition)]
})
export class InputDefinitionModule {
}
