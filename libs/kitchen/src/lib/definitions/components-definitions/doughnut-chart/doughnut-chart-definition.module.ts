import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, doughnutChartSample, KitchenComponent, KitchenType, nextComponentId } from '@common/public-api';
import { TriIconModule } from '@gradii/triangle/icon';
import { EchartsModule } from '../../../directives/echarts/echarts.module';
import { dataPropsFactory } from '../../../workflow/data/data-factory';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { dataValidator } from './data-validator';
import { DoughnutChartDefinitionComponent, DoughnutChartDefinitionDirective } from './doughnut-chart-definition';
import { BkDoughnutChartComponent } from './doughnut-chart.component';

export function doughnutChartFactory(): KitchenComponent {
  return {
    id: nextComponentId(), type: KitchenType.Component,
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
  icon: 'workbench:donut',
  order: 1600,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['graph', 'chart', 'donut', 'diagram', 'histogram']
};

@NgModule({
    imports: [DefinitionUtilsModule, CommonModule, EchartsModule, TriIconModule],
    exports: [DoughnutChartDefinitionComponent],
    declarations: [DoughnutChartDefinitionDirective, DoughnutChartDefinitionComponent, BkDoughnutChartComponent],
    providers: [
        createDefinitionProvider(doughnutChartDefinition),
        createMetaDefinitionProvider(doughnutChartMetaDefinition)
    ]
})
export class DoughnutChartDefinitionModule {
}
