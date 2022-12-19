import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, multipleBarChartSample, nextComponentId, KitchenComponent, KitchenType } from '@common/public-api';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import {
  MultipleBarChartDefinitionComponent,
  MultipleBarChartDefinitionDirective
} from './multiple-bar-chart-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { BkMultipleBarChartComponent } from './multiple-bar-chart.component';
import { EchartsModule } from '../../../directives/echarts/echarts.module';
import { dataValidator } from './data-validator';
import { dataPropsFactory } from '../../../workflow/data/data-factory';
import { TriIconModule } from '@gradii/triangle/icon';

export function multipleBarChartFactory(): KitchenComponent {
  return {
    id: nextComponentId(), type: KitchenType.Component,
    definitionId: 'multipleBarChart',
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
      name: 'MultipleBarChart',
      ...dataPropsFactory(multipleBarChartSample)
    },
    actions: {
      init: []
    }
  };
}

const multipleBarChartDefinition: Definition = {
  id: 'multipleBarChart',
  componentType: BkMultipleBarChartComponent,
  definition: MultipleBarChartDefinitionComponent,
  factory: multipleBarChartFactory,
  dataTrigger: true,
  dataConsumer: true,
  dataValidator
};

const multipleBarChartMetaDefinition: MetaDefinition = {
  definition: multipleBarChartDefinition,
  name: 'Multiple Bar Chart',
  icon: 'workbench:multi-bar-chart',
  order: 1800,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['graph', 'chart', 'diagram', 'histogram', 'stock', 'bar']
};

@NgModule({
    imports: [DefinitionUtilsModule, CommonModule, EchartsModule, TriIconModule],
    exports: [MultipleBarChartDefinitionComponent],
    declarations: [MultipleBarChartDefinitionDirective, MultipleBarChartDefinitionComponent, BkMultipleBarChartComponent],
    providers: [
        createDefinitionProvider(multipleBarChartDefinition),
        createMetaDefinitionProvider(multipleBarChartMetaDefinition)
    ]
})
export class MultipleBarChartDefinitionModule {
}
