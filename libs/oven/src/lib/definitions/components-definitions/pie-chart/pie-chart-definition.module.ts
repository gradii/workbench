import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BreakpointWidth, nextComponentId, OvenComponent, pieChartSample } from '@common';
import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { PieChartDefinitionComponent, PieChartDefinitionDirective } from './pie-chart-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { BkPieChartComponent } from './pie-chart.component';
import { EchartsModule } from '../../../directives/echarts/echarts.module';
import { dataValidator } from './data-validator';
import { dataPropsFactory } from '../../../workflow/data/data-factory';
import { NbIconModule } from '@nebular/theme';

export function pieChartFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'pieChart',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        size: {
          widthValue: 100,
          widthUnit: '%',
          widthAuto: false,
          heightValue: 100,
          heightUnit: '%',
          heightAuto: false
        }
      }
    },
    properties: {
      name: 'PieChart',
      ...dataPropsFactory(pieChartSample)
    },
    actions: {
      init: []
    }
  };
}

const pieChartDefinition: Definition = {
  id: 'pieChart',
  componentType: BkPieChartComponent,
  definition: PieChartDefinitionComponent,
  factory: pieChartFactory,
  dataTrigger: true,
  dataConsumer: true,
  dataValidator
};

const pieChartMetaDefinition: MetaDefinition = {
  definition: pieChartDefinition,
  name: 'Pie Chart',
  icon: 'pie-chart-component',
  order: 1500,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['graph', 'chart', 'diagram', 'histogram', 'pie']
};

@NgModule({
  imports: [DefinitionUtilsModule, CommonModule, EchartsModule, NbIconModule],
  exports: [PieChartDefinitionComponent],
  declarations: [PieChartDefinitionDirective, PieChartDefinitionComponent, BkPieChartComponent],
  entryComponents: [PieChartDefinitionComponent],
  providers: [createDefinitionProvider(pieChartDefinition), createMetaDefinitionProvider(pieChartMetaDefinition)]
})
export class PieChartDefinitionModule {
}
