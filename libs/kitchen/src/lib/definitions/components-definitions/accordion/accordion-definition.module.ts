import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, KitchenComponent, KitchenSlot, KitchenType, nextComponentId } from '@common/public-api';
import { AccordionComponent, TriAccordionModule } from '@gradii/triangle/accordion';
import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';

import { spaceFactory } from '../space/space-definition.module';
import {
  AccordionDefinitionComponent, AccordionDefinitionDirective, AccordionItemSlotDirective
} from './accordion-definition';

export function accordionFactory(): KitchenComponent {
  return {
    id          : nextComponentId(),
    type        : KitchenType.Component,
    definitionId: 'accordion',
    slots       : {
      item0: new KitchenSlot(
        [spaceFactory([], 'flex-start', true)], undefined, []
      ),
      item1: new KitchenSlot(
        [spaceFactory([], 'flex-start', true)], undefined, []
      )
    },
    featureList: [],
    styles      : {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size   : {
          widthValue : 100,
          widthUnit  : '%',
          widthAuto  : false,
          heightValue: 200,
          heightUnit : 'px',
          heightAuto : true
        },
        multi  : false
      }
    },
    properties  : {
      options  : [
        { value: 'Item 1', id: 'item0' },
        { value: 'Item 2', id: 'item1' }
      ],
      container: true,
      name     : 'Accordion'
    },
    actions     : {
      init: []
    }
  };
}

const accordionDefinition: Definition = {
  id           : 'accordion',
  componentType: AccordionComponent,
  definition   : AccordionDefinitionComponent,
  factory      : accordionFactory
};

const accordionMetaDefinition: MetaDefinition = {
  definition    : accordionDefinition,
  name          : 'Accordion',
  icon          : 'workbench:accordion',
  order         : 1250,
  headerSupport : false,
  sidebarSupport: false,
  tags          : ['collapse', 'collapsible']
};

@NgModule({
    imports: [DefinitionUtilsModule, TriAccordionModule, CommonModule, ScrollingModule],
    exports: [AccordionDefinitionComponent],
    declarations: [AccordionDefinitionDirective, AccordionDefinitionComponent, AccordionItemSlotDirective],
    providers: [
        createDefinitionProvider(accordionDefinition), createMetaDefinitionProvider(accordionMetaDefinition)
    ]
})
export class AccordionDefinitionModule {
}
