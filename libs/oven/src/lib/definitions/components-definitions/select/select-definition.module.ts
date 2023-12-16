import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbSelectComponent, NbSelectModule } from '@nebular/theme';
import { BreakpointWidth, FormFieldWidthType, nextComponentId, OvenComponent } from '@common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { SelectDefinitionComponent, SelectDefinitionDirective } from './select-definition';

export function selectFactory(): OvenComponent {
  return {
    id: nextComponentId(),
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
  componentType: NbSelectComponent,
  definition: SelectDefinitionComponent,
  dataTrigger: true,
  propsMapper,
  factory: selectFactory
};

const selectMetaDefinition: MetaDefinition = {
  definition: selectDefinition,
  name: 'Select',
  icon: 'select',
  order: 700,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['dropdown', 'form', 'control']
};

@NgModule({
  imports: [DefinitionUtilsModule, NbSelectModule, CommonModule],
  exports: [SelectDefinitionComponent],
  declarations: [SelectDefinitionDirective, SelectDefinitionComponent],
  entryComponents: [SelectDefinitionComponent],
  providers: [createDefinitionProvider(selectDefinition), createMetaDefinitionProvider(selectMetaDefinition)]
})
export class SelectDefinitionModule {
}
