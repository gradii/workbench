import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbAccordionComponent, NbAccordionModule } from '@nebular/theme';
import { BreakpointWidth, nextComponentId, OvenComponent, OvenSlot } from '@common';

import { spaceFactory } from '../space/space-definition.module';
import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import {
  AccordionDefinitionComponent,
  AccordionDefinitionDirective,
  AccordionItemSlotDirective
} from './accordion-definition';

export function accordionFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'accordion',
    slots: {
      item0: new OvenSlot([spaceFactory([], 'flex-start', true)]),
      item1: new OvenSlot([spaceFactory([], 'flex-start', true)])
    },
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size: {
          widthValue: 100,
          widthUnit: '%',
          widthAuto: false,
          heightValue: 200,
          heightUnit: 'px',
          heightAuto: true
        },
        multi: false
      }
    },
    properties: {
      options: [
        { value: 'Item 1', id: 'item0' },
        { value: 'Item 2', id: 'item1' }
      ],
      container: true,
      name: 'Accordion'
    },
    actions: {
      init: []
    }
  };
}

const accordionDefinition: Definition = {
  id: 'accordion',
  componentType: NbAccordionComponent,
  definition: AccordionDefinitionComponent,
  factory: accordionFactory
};

const accordionMetaDefinition: MetaDefinition = {
  definition: accordionDefinition,
  name: 'Accordion',
  icon: 'accordion',
  order: 1250,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['collapse', 'collapsible']
};

@NgModule({
  imports: [DefinitionUtilsModule, NbAccordionModule, CommonModule, ScrollingModule],
  exports: [AccordionDefinitionComponent],
  declarations: [AccordionDefinitionDirective, AccordionDefinitionComponent, AccordionItemSlotDirective],
  entryComponents: [AccordionDefinitionComponent],
  providers: [createDefinitionProvider(accordionDefinition), createMetaDefinitionProvider(accordionMetaDefinition)]
})
export class AccordionDefinitionModule {
}
