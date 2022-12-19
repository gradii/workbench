import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreakpointWidth, KitchenComponent, KitchenType, nextComponentId } from '@common/public-api';
import { TriCheckboxModule, CheckboxComponent } from '@gradii/triangle/checkbox';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { stringValidator } from '../../definition-utils/data-validators';
import { CheckboxDefinitionComponent, CheckboxDefinitionDirective } from './checkbox-definition';

export function checkboxFactory(): KitchenComponent {
  return {
    id: nextComponentId(),
    type: KitchenType.Component,
    definitionId: 'checkbox',
    styles      : {
      [BreakpointWidth.Desktop]: {
        visible: true
      }
    },
    properties  : {
      label   : 'Toggle me',
      status  : 'success',
      disabled: false,
      name    : 'Checkbox'
    },
    actions     : {
      change: []
    }
  };
}

const checkboxDefinition: Definition = {
  id           : 'checkbox',
  componentType: CheckboxComponent,
  definition   : CheckboxDefinitionComponent,
  dataTrigger  : true,
  dataConsumer : true,
  dataValidator: stringValidator,
  factory      : checkboxFactory
};

const checkboxMetaDefinition: MetaDefinition = {
  definition    : checkboxDefinition,
  name          : 'Checkbox',
  icon          : 'workbench:checkbox',
  order         : 650,
  headerSupport : true,
  sidebarSupport: true,
  tags          : ['form', 'control']
};

@NgModule({
    imports: [DefinitionUtilsModule, TriCheckboxModule, CommonModule, FormsModule],
    exports: [CheckboxDefinitionComponent],
    declarations: [CheckboxDefinitionDirective, CheckboxDefinitionComponent],
    providers: [
        createDefinitionProvider(checkboxDefinition),
        createMetaDefinitionProvider(checkboxMetaDefinition)
    ]
})
export class CheckboxDefinitionModule {
}
