import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbDatepickerComponent, NbDatepickerModule, NbInputModule } from '@nebular/theme';
import { BreakpointWidth, FormFieldWidthType, nextComponentId, OvenComponent } from '@common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { DatepickerDefinitionComponent, DatepickerDefinitionDirective } from './datepicker-definition';

export function datepickerFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'datepicker',
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
      placeholder: 'Enter Date',
      status: 'basic',
      shape: 'rectangle',
      disabled: false,
      name: 'Datepicker'
    },
    actions: {
      change: []
    }
  };
}

const datepickerDefinition: Definition = {
  id: 'datepicker',
  componentType: NbDatepickerComponent,
  definition: DatepickerDefinitionComponent,
  dataTrigger: true,
  factory: datepickerFactory
};

const datepickerMetaDefinition: MetaDefinition = {
  definition: datepickerDefinition,
  name: 'Date Picker',
  icon: 'datepicker',
  order: 750,
  headerSupport: true,
  sidebarSupport: true,
  tags: ['date', 'calendar', 'datepicker']
};

@NgModule({
  imports: [DefinitionUtilsModule, NbInputModule, NbDatepickerModule, CommonModule],
  exports: [DatepickerDefinitionComponent],
  declarations: [DatepickerDefinitionDirective, DatepickerDefinitionComponent],
  entryComponents: [DatepickerDefinitionComponent],
  providers: [createDefinitionProvider(datepickerDefinition), createMetaDefinitionProvider(datepickerMetaDefinition)]
})
export class DatepickerDefinitionModule {
}
