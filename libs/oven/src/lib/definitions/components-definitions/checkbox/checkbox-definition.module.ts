import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbCheckboxComponent, NbCheckboxModule } from '@nebular/theme';
import { BreakpointWidth, nextComponentId, OvenComponent } from '@common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { stringValidator } from '../../definition-utils/data-validators';
import { CheckboxDefinitionComponent, CheckboxDefinitionDirective } from './checkbox-definition';

export function checkboxFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'checkbox',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true
      }
    },
    properties: {
      label: 'Toggle me',
      status: 'success',
      disabled: false,
      name: 'Checkbox'
    },
    actions: {
      change: []
    }
  };
}

const checkboxDefinition: Definition = {
  id: 'checkbox',
  componentType: NbCheckboxComponent,
  definition: CheckboxDefinitionComponent,
  dataTrigger: true,
  dataConsumer: true,
  dataValidator: stringValidator,
  factory: checkboxFactory
};

const checkboxMetaDefinition: MetaDefinition = {
  definition: checkboxDefinition,
  name: 'Checkbox',
  icon: 'checkbox',
  order: 650,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['form', 'control']
};

@NgModule({
  imports: [DefinitionUtilsModule, NbCheckboxModule, CommonModule, FormsModule],
  exports: [CheckboxDefinitionComponent],
  declarations: [CheckboxDefinitionDirective, CheckboxDefinitionComponent],
  entryComponents: [CheckboxDefinitionComponent],
  providers: [createDefinitionProvider(checkboxDefinition), createMetaDefinitionProvider(checkboxMetaDefinition)]
})
export class CheckboxDefinitionModule {
}
