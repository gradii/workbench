import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, doughnutChartSample, nextComponentId, OvenComponent } from '@common';
import { NbIconModule } from '@nebular/theme';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DoughnutChartDefinitionComponent, DoughnutChartDefinitionDirective } from './doughnut-chart-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { BkDoughnutChartComponent } from './doughnut-chart.component';
import { EchartsModule } from '../../../directives/echarts/echarts.module';
import { dataValidator } from './data-validator';
import { dataPropsFactory } from '../../../workflow/data/data-factory';

export function doughnutChartFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'doughnutChart',
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
      ...dataPropsFactory(doughnutChartSample),
      name: 'DoughnutChart'
    },
    actions: {
      init: []
    }
  };
}

const doughnutChartDefinition: Definition = {
  id: 'doughnutChart',
  componentType: BkDoughnutChartComponent,
  definition: DoughnutChartDefinitionComponent,
  factory: doughnutChartFactory,
  dataTrigger: true,
  dataConsumer: true,
  dataValidator
};

const doughnutChartMetaDefinition: MetaDefinition = {
  definition: doughnutChartDefinition,
  name: 'Doughnut Chart',
  icon: 'donut',
  order: 1600,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['graph', 'chart', 'donut', 'diagram', 'histogram']
};

@NgModule({
  imports: [DefinitionUtilsModule, CommonModule, EchartsModule, NbIconModule],
  exports: [DoughnutChartDefinitionComponent],
  declarations: [DoughnutChartDefinitionDirective, DoughnutChartDefinitionComponent, BkDoughnutChartComponent],
  entryComponents: [DoughnutChartDefinitionComponent],
  providers: [
    createDefinitionProvider(doughnutChartDefinition),
    createMetaDefinitionProvider(doughnutChartMetaDefinition)
  ]
})
export class DoughnutChartDefinitionModule {
}
