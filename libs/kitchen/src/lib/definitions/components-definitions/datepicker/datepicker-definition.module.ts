import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, FormFieldWidthType, nextComponentId, KitchenComponent, KitchenType } from '@common/public-api';
import { TriInputModule } from '@gradii/triangle/input';
import { DatePickerComponent, TriDatePickerModule } from '@gradii/triangle/date-picker';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { DatepickerDefinitionComponent, DatepickerDefinitionDirective } from './datepicker-definition';

export function datepickerFactory(): KitchenComponent {
  return {
    id: nextComponentId(),
    type: KitchenType.Component,
    definitionId: 'datepicker',
    styles      : {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size   : 'medium',
        width  : {
          type       : FormFieldWidthType.AUTO,
          customValue: 220,
          customUnit : 'px'
        }
      }
    },
    properties  : {
      placeholder: 'Enter Date',
      status     : 'basic',
      shape      : 'rectangle',
      disabled   : false,
      name       : 'Datepicker'
    },
    actions     : {
      change: []
    }
  };
}

const datepickerDefinition: Definition = {
  id           : 'datepicker',
  componentType: DatePickerComponent,
  definition   : DatepickerDefinitionComponent,
  dataTrigger  : true,
  factory      : datepickerFactory
};

const datepickerMetaDefinition: MetaDefinition = {
  definition    : datepickerDefinition,
  name          : 'Date Picker',
  icon          : 'workbench:datepicker',
  order         : 750,
  headerSupport : true,
  sidebarSupport: true,
  tags          : ['date', 'calendar', 'datepicker']
};

@NgModule({
  imports     : [DefinitionUtilsModule, TriInputModule, TriDatePickerModule, CommonModule],
  exports     : [DatepickerDefinitionComponent],
  declarations: [DatepickerDefinitionDirective, DatepickerDefinitionComponent],
  providers   : [
    createDefinitionProvider(datepickerDefinition),
    createMetaDefinitionProvider(datepickerMetaDefinition)
  ]
})
export class DatepickerDefinitionModule {
}
