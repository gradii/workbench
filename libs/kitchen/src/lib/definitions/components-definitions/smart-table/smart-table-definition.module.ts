import { NgModule } from '@angular/core';
import { BreakpointWidth, nextComponentId, KitchenComponent, KitchenType } from '@common/public-api';
import { Ng2SmartTableModule, Ng2SmartTableComponent } from 'ng2-smart-table';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { SmartTableDefinitionComponent, SmartTableDefinitionDirective } from './smart-table-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { dataPropsFactory } from '../../../workflow/data/data-factory';
import { dataValidator } from './data-validator';

export const smartTableSample = [
  { id: 1, fullName: 'Danielle Kennedy', userName: 'danielle.kennedy', email: 'danielle_91@example.com' },
  { id: 2, fullName: 'Russell Payne', userName: 'russell.payne', email: 'russell_88@example.com' },
  { id: 3, fullName: 'Brenda Hanson', userName: 'brenda.hanson', email: 'brenda97@example.com' },
  { id: 4, fullName: 'Nathan Knight', userName: 'nathan.knight', email: 'nathan-85@example.com' }
];

export function smartTableFactory(): KitchenComponent {
  return {
    id: nextComponentId(),
    type: KitchenType.Component,
    definitionId: 'smartTable',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size: {
          widthValue: 100,
          widthUnit: '%',
          widthAuto: true,
          heightValue: 150,
          heightUnit: 'px',
          heightAuto: true
        }
      }
    },
    properties: {
      ...dataPropsFactory(smartTableSample, 'source'),
      name: 'SmartTable',
      settings: {
        columns: {
          id: {
            title: 'ID',
            filter: true
          },
          fullName: {
            title: 'Full Name',
            filter: true
          },
          userName: {
            title: 'User Name',
            filter: true
          },
          email: {
            title: 'Email',
            filter: true
          }
        },
        delete: {
          confirmDelete: true
        },
        add: {
          confirmCreate: true
        },
        edit: {
          confirmSave: true
        },
        actions: {
          add: true,
          edit: true,
          delete: true
        },
        mode: 'internal',
        pager: { perPage: 10 }
      }
    },
    actions: {
      init: [],
      smartTableCreate: [],
      smartTableEdit: [],
      smartTableDelete: [],
      smartTableRowSelect: []
    }
  };
}

const tableDefinition: Definition = {
  id: 'smartTable',
  componentType: Ng2SmartTableComponent,
  definition: SmartTableDefinitionComponent,
  factory: smartTableFactory,
  dataTrigger: true,
  dataConsumer: true,
  dataValidator
};

const tableMetaDefinition: MetaDefinition = {
  definition: tableDefinition,
  name: 'Smart Table',
  icon: 'workbench:smart-table',
  order: 350,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['data', 'smart']
};

@NgModule({
    imports: [DefinitionUtilsModule, Ng2SmartTableModule],
    exports: [SmartTableDefinitionComponent],
    declarations: [SmartTableDefinitionDirective, SmartTableDefinitionComponent],
    providers: [createDefinitionProvider(tableDefinition), createMetaDefinitionProvider(tableMetaDefinition)]
})
export class SmartTableDefinitionModule {
}
