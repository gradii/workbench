import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbTabsetComponent, NbTabsetModule } from '@nebular/theme';
import { BreakpointWidth, nextComponentId, OvenComponent, OvenSlot } from '@common';

import { spaceFactory } from '../space/space-definition.module';
import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { TabsDefinitionComponent, TabsDefinitionDirective, TabSlotDirective } from './tabs-definition';

export function tabsFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'tabs',
    slots: {
      tab0: new OvenSlot([spaceFactory([], 'flex-start', true)]),
      tab1: new OvenSlot([spaceFactory([], 'flex-start', true)])
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
        paddings: {
          paddingTop: 8,
          paddingTopUnit: 'px',
          paddingRight: 16,
          paddingRightUnit: 'px',
          paddingBottom: 8,
          paddingBottomUnit: 'px',
          paddingLeft: 16,
          paddingLeftUnit: 'px'
        }
      }
    },
    properties: {
      options: [
        { value: 'Tab 1', id: 'tab0' },
        { value: 'Tab 2', id: 'tab1' }
      ],
      container: true,
      name: 'Tabs'
    },
    actions: {
      init: [],
      tabsChangeTab: []
    }
  };
}

const tabsDefinition: Definition = {
  id: 'tabs',
  componentType: NbTabsetComponent,
  definition: TabsDefinitionComponent,
  factory: tabsFactory
};

const tabsMetaDefinition: MetaDefinition = {
  definition: tabsDefinition,
  name: 'Tabs',
  icon: 'tab',
  order: 1200,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['tabset']
};

@NgModule({
  imports: [DefinitionUtilsModule, NbTabsetModule, CommonModule, ScrollingModule],
  exports: [TabsDefinitionComponent],
  declarations: [TabsDefinitionDirective, TabsDefinitionComponent, TabSlotDirective],
  entryComponents: [TabsDefinitionComponent],
  providers: [createDefinitionProvider(tabsDefinition), createMetaDefinitionProvider(tabsMetaDefinition)]
})
export class TabsDefinitionModule {
}
