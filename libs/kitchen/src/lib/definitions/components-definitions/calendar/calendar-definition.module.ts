import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalendarComponent, TriCalendarModule } from '@gradii/triangle/calendar';
import { BreakpointWidth, KitchenComponent, KitchenType, nextComponentId } from '@common/public-api';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { CalendarDefinitionComponent, CalendarDefinitionDirective } from './calendar-definition';

export function calendarFactory(): KitchenComponent {
  return {
    id: nextComponentId(),
    type: KitchenType.Component,
    definitionId: 'calendar',
    styles      : {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size   : 'medium'
      }
    },
    properties  : {
      name          : 'Calendar',
      startView     : 'date',
      showNavigation: true
    }
  };
}

const calendarDefinition: Definition = {
  id           : 'calendar',
  componentType: CalendarComponent,
  definition   : CalendarDefinitionComponent,
  factory      : calendarFactory
};

const calendarMetaDefinition: MetaDefinition = {
  definition    : calendarDefinition,
  name          : 'Calendar',
  icon          : 'workbench:calendar',
  order         : 1100,
  headerSupport : false,
  sidebarSupport: false,
  tags          : ['date', 'day', 'month', 'year']
};

@NgModule({
    imports: [DefinitionUtilsModule, TriCalendarModule, CommonModule, TriCalendarModule],
    exports: [CalendarDefinitionComponent],
    declarations: [CalendarDefinitionDirective, CalendarDefinitionComponent],
    providers: [createDefinitionProvider(calendarDefinition), createMetaDefinitionProvider(calendarMetaDefinition)]
})
export class CalendarDefinitionModule {
}
