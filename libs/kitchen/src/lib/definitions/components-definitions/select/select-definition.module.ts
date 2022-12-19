import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, FormFieldWidthType, nextComponentId, KitchenComponent, KitchenType } from '@common/public-api';
import { TriSelectModule, TriSelect } from '@gradii/triangle/select';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { SelectDefinitionComponent, SelectDefinitionDirective } from './select-definition';

export function selectFactory(): KitchenComponent {
  return {
    id: nextComponentId(), type: KitchenType.Component,
    definitionId: 'select',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size: 'medium',
        width: {
          type: FormFieldWidthType.AUTO,
          customValue: 220,
          customUnit: 'px'
        }
      }
    },
    properties: {
      placeholder: 'select',
      status: 'primary',
      disabled: false,
      name: 'Select',
      options: [{ value: 'option 1' }, { value: 'option 2' }]
    },
    actions: {
      change: []
    }
  };
}

export function propsMapper(instance, props): void {
  for (const [key, value] of Object.entries(props)) {
    if (key === 'options') {
      instance['optionsList'] = value;
      continue;
    }

    instance[key] = value;
  }
}

const selectDefinition: Definition = {
  id: 'select',
  componentType: TriSelect,
  definition: SelectDefinitionComponent,
  dataTrigger: true,
  propsMapper,
  factory: selectFactory
};

const selectMetaDefinition: MetaDefinition = {
  definition: selectDefinition,
  name: 'Select',
  icon: 'workbench:select',
  order: 700,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['dropdown', 'form', 'control']
};

@NgModule({
    imports: [DefinitionUtilsModule, TriSelectModule, CommonModule],
    exports: [SelectDefinitionComponent],
    declarations: [SelectDefinitionDirective, SelectDefinitionComponent],
    providers: [
        createDefinitionProvider(selectDefinition),
        createMetaDefinitionProvider(selectMetaDefinition)
    ]
})
export class SelectDefinitionModule {
}
