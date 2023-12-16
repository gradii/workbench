import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, nextComponentId, OvenComponent, OvenSlot } from '@common';
import { NbListComponent, NbListModule } from '@nebular/theme';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { spaceFactory } from '../space/space-definition.module';
import { textFactory } from '../text/text-definition.module';
import { ListDefinitionComponent, ListDefinitionDirective, ListItemSlotDirective } from './list-definition';

export function listFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'list',
    slots: {
      'row.0': new OvenSlot([spaceFactory([textFactory('Item 1')], 'flex-start', true)]),
      'row.1': new OvenSlot([spaceFactory([textFactory('Item 2')], 'flex-start', true)]),
      'row.2': new OvenSlot([spaceFactory([textFactory('Item 3')], 'flex-start', true)]),
      'row.3': new OvenSlot([spaceFactory([textFactory('Item 4')], 'flex-start', true)]),
      'row.4': new OvenSlot([spaceFactory([textFactory('Item 5')], 'flex-start', true)])
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
        }
      }
    },
    properties: {
      rows: [{ id: 'row.0' }, { id: 'row.1' }, { id: 'row.2' }, { id: 'row.3' }, { id: 'row.4' }],
      container: true,
      name: 'List'
    },
    actions: {
      init: []
    }
  };
}

const listDefinition: Definition = {
  id: 'list',
  componentType: NbListComponent,
  definition: ListDefinitionComponent,
  factory: listFactory
};

const listMetaDefinition: MetaDefinition = {
  definition: listDefinition,
  name: 'List',
  icon: 'list',
  order: 1250,
  headerSupport: false,
  sidebarSupport: true,
  tags: ['list', 'array']
};

@NgModule({
  imports: [DefinitionUtilsModule, NbListModule, CommonModule, ScrollingModule],
  exports: [ListDefinitionComponent],
  declarations: [ListDefinitionDirective, ListDefinitionComponent, ListItemSlotDirective],
  entryComponents: [ListDefinitionComponent],
  providers: [createDefinitionProvider(listDefinition), createMetaDefinitionProvider(listMetaDefinition)]
})
export class ListDefinitionModule {
}
