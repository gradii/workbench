import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCalendarComponent, NbCalendarModule } from '@nebular/theme';
import { BreakpointWidth, nextComponentId, OvenComponent } from '@common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { CalendarDefinitionComponent, CalendarDefinitionDirective } from './calendar-definition';

export function calendarFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'calendar',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size: 'medium'
      }
    },
    properties: {
      name: 'Calendar',
      startView: 'date',
      showNavigation: true
    }
  };
}

const calendarDefinition: Definition = {
  id: 'calendar',
  componentType: NbCalendarComponent,
  definition: CalendarDefinitionComponent,
  factory: calendarFactory
};

const calendarMetaDefinition: MetaDefinition = {
  definition: calendarDefinition,
  name: 'Calendar',
  icon: 'calendar',
  order: 1100,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['date', 'day', 'month', 'year']
};

@NgModule({
  imports: [DefinitionUtilsModule, NbCalendarModule, CommonModule],
  exports: [CalendarDefinitionComponent],
  declarations: [CalendarDefinitionDirective, CalendarDefinitionComponent],
  entryComponents: [CalendarDefinitionComponent],
  providers: [createDefinitionProvider(calendarDefinition), createMetaDefinitionProvider(calendarMetaDefinition)]
})
export class CalendarDefinitionModule {
}
