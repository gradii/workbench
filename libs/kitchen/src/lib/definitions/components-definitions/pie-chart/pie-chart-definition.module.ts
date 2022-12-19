import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BreakpointWidth, KitchenComponent, KitchenType, nextComponentId, pieChartSample } from '@common/public-api';
import { TriIconModule } from '@gradii/triangle/icon';
import { EchartsModule } from '../../../directives/echarts/echarts.module';
import { dataPropsFactory } from '../../../workflow/data/data-factory';
import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { dataValidator } from './data-validator';
import { PieChartDefinitionComponent, PieChartDefinitionDirective } from './pie-chart-definition';
import { BkPieChartComponent } from './pie-chart.component';

export function pieChartFactory(): KitchenComponent {
  return {
    id: nextComponentId(), type: KitchenType.Component,
    definitionId: 'pieChart',
    styles      : {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size   : {
          widthValue : 100,
          widthUnit  : '%',
          widthAuto  : false,
          heightValue: 100,
          heightUnit : '%',
          heightAuto : false
        }
      }
    },
    properties  : {
      name: 'PieChart',
      ...dataPropsFactory(pieChartSample)
    },
    actions     : {
      init: []
    }
  };
}

const pieChartDefinition: Definition = {
  id           : 'pieChart',
  componentType: BkPieChartComponent,
  definition   : PieChartDefinitionComponent,
  factory      : pieChartFactory,
  dataTrigger  : true,
  dataConsumer : true,
  dataValidator
};

const pieChartMetaDefinition: MetaDefinition = {
  definition    : pieChartDefinition,
  name          : 'Pie Chart',
  icon          : 'workbench:pie-chart-component',
  order         : 1500,
  headerSupport : false,
  sidebarSupport: false,
  tags          : ['graph', 'chart', 'diagram', 'histogram', 'pie']
};

@NgModule({
    imports: [DefinitionUtilsModule, CommonModule, EchartsModule, TriIconModule],
    exports: [PieChartDefinitionComponent],
    declarations: [PieChartDefinitionDirective, PieChartDefinitionComponent, BkPieChartComponent],
    providers: [
        createDefinitionProvider(pieChartDefinition),
        createMetaDefinitionProvider(pieChartMetaDefinition)
    ]
})
export class PieChartDefinitionModule {
}
