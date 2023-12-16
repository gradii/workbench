import { NgModule } from '@angular/core';
import {
  BreakpointWidth,
  ComponentPaddings,
  FormFieldWidthType,
  nextComponentId,
  OvenComponent,
  OvenSlot
} from '@common';
import { CommonModule } from '@angular/common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import {
  TableCellSlotDirective,
  TableDefinitionComponent,
  TableDefinitionDirective,
  TableDirective
} from './table-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { spaceFactory } from '../space/space-definition.module';
import { textFactory } from '../text/text-definition.module';

export function tableFactory(): OvenComponent {
  const cellPaddings: ComponentPaddings = {
    paddingTop: 4,
    paddingTopUnit: 'px',
    paddingRight: 8,
    paddingRightUnit: 'px',
    paddingBottom: 4,
    paddingBottomUnit: 'px',
    paddingLeft: 8,
    paddingLeftUnit: 'px'
  };

  return {
    id: nextComponentId(),
    definitionId: 'table',
    slots: {
      header0: new OvenSlot([spaceFactory([textFactory('Header 1', 'subtitle')], 'center', true, cellPaddings)]),
      header1: new OvenSlot([spaceFactory([textFactory('Header 2', 'subtitle')], 'center', true, cellPaddings)]),
      cell00: new OvenSlot([spaceFactory([], 'center', true, cellPaddings)]),
      cell01: new OvenSlot([spaceFactory([], 'center', true, cellPaddings)]),
      cell10: new OvenSlot([spaceFactory([], 'center', true, cellPaddings)]),
      cell11: new OvenSlot([spaceFactory([], 'center', true, cellPaddings)])
    },
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size: {
          widthValue: 100,
          widthUnit: '%',
          widthAuto: false,
          heightValue: 150,
          heightUnit: 'px',
          heightAuto: true
        },
        background: {
          color: 'transparent'
        }
      }
    },
    properties: {
      border: true,
      columns: [
        {
          id: 'header0',
          width: {
            type: FormFieldWidthType.AUTO,
            customValue: 200,
            customUnit: 'px'
          }
        },
        {
          id: 'header1',
          width: {
            type: FormFieldWidthType.AUTO,
            customValue: 200,
            customUnit: 'px'
          }
        }
      ],
      rows: [
        {
          id: 'row0',
          cells: [{ id: 'cell00' }, { id: 'cell01' }]
        },
        {
          id: 'row1',
          cells: [{ id: 'cell10' }, { id: 'cell11' }]
        }
      ],
      container: true,
      name: 'Table'
    },
    actions: {
      init: []
    }
  };
}

const tableDefinition: Definition = {
  id: 'table',
  componentType: TableDirective,
  definition: TableDefinitionComponent,
  factory: tableFactory
};

const tableMetaDefinition: MetaDefinition = {
  definition: tableDefinition,
  name: 'Table',
  icon: 'table',
  order: 350,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['data']
};

@NgModule({
  imports: [DefinitionUtilsModule, CommonModule],
  exports: [TableDefinitionComponent],
  declarations: [TableDirective, TableDefinitionDirective, TableCellSlotDirective, TableDefinitionComponent],
  entryComponents: [TableDefinitionComponent],
  providers: [createDefinitionProvider(tableDefinition), createMetaDefinitionProvider(tableMetaDefinition)]
})
export class TableDefinitionModule {
}
