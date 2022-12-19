import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, KitchenComponent, KitchenSlot, KitchenType, nextComponentId } from '@common/public-api';
import { TriTabGroup, TriTabsModule } from '@gradii/triangle/tabs';

import { spaceFactory } from '../space/space-definition.module';
import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { TabsDefinitionComponent, TabsDefinitionDirective, TabSlotDirective } from './tabs-definition';

export function tabsFactory(): KitchenComponent {
  return {
    id          : nextComponentId(), type: KitchenType.Component,
    definitionId: 'tabs',
    slots       : {
      tab0: new KitchenSlot([spaceFactory([], 'flex-start', true)]),
      tab1: new KitchenSlot([spaceFactory([], 'flex-start', true)])
    },
    styles      : {
      [BreakpointWidth.Desktop]: {
        visible : true,
        size    : {
          widthValue : 100,
          widthUnit  : '%',
          widthAuto  : false,
          heightValue: 200,
          heightUnit : 'px',
          heightAuto : true
        },
        paddings: {
          paddingTop       : 8,
          paddingTopUnit   : 'px',
          paddingRight     : 16,
          paddingRightUnit : 'px',
          paddingBottom    : 8,
          paddingBottomUnit: 'px',
          paddingLeft      : 16,
          paddingLeftUnit  : 'px'
        }
      }
    },
    properties  : {
      options  : [
        { value: 'Tab 1', id: 'tab0' },
        { value: 'Tab 2', id: 'tab1' }
      ],
      container: true,
      name     : 'Tabs'
    },
    actions     : {
      init         : [],
      tabsChangeTab: []
    }
  };
}

const tabsDefinition: Definition = {
  id           : 'tabs',
  componentType: TriTabGroup,
  definition   : TabsDefinitionComponent,
  factory      : tabsFactory
};

const tabsMetaDefinition: MetaDefinition = {
  definition    : tabsDefinition,
  name          : 'Tabs',
  icon          : 'workbench:tab',
  order         : 1200,
  headerSupport : false,
  sidebarSupport: false,
  tags          : ['tabset']
};

@NgModule({
    imports: [DefinitionUtilsModule, TriTabsModule, CommonModule, ScrollingModule],
    exports: [TabsDefinitionComponent],
    declarations: [TabsDefinitionDirective, TabsDefinitionComponent, TabSlotDirective],
    providers: [createDefinitionProvider(tabsDefinition), createMetaDefinitionProvider(tabsMetaDefinition)]
})
export class TabsDefinitionModule {
}
