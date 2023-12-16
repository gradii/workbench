import { CommonModule } from '@angular/common';
import { NbIconModule } from '@nebular/theme';
import { NgModule } from '@angular/core';

import { BreakpointWidth, multipleAxisChartSample, nextComponentId, OvenComponent } from '@common';
import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import {
  MultipleAxisChartDefinitionComponent,
  MultipleAxisChartDefinitionDirective
} from './multiple-axis-chart-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { BkMultipleAxisChartComponent } from './multiple-axis-chart.component';
import { EchartsModule } from '../../../directives/echarts/echarts.module';
import { dataValidator } from './data-validator';
import { dataPropsFactory } from '../../../workflow/data/data-factory';

export function multipleAxisChartFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'multipleAxisChart',
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
      name: 'MultipleAxisChart',
      ...dataPropsFactory(multipleAxisChartSample)
    },
    actions: {
      init: []
    }
  };
}

const multipleAxisChartDefinition: Definition = {
  id: 'multipleAxisChart',
  componentType: BkMultipleAxisChartComponent,
  definition: MultipleAxisChartDefinitionComponent,
  factory: multipleAxisChartFactory,
  dataTrigger: true,
  dataConsumer: true,
  dataValidator
};

const multipleAxisChartMetaDefinition: MetaDefinition = {
  definition: multipleAxisChartDefinition,
  name: 'Multiple Axis Chart',
  icon: 'multi-axis-chart',
  order: 1700,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['graph', 'chart', 'diagram', 'histogram', 'stock']
};

@NgModule({
  imports: [DefinitionUtilsModule, CommonModule, EchartsModule, NbIconModule],
  exports: [MultipleAxisChartDefinitionComponent],
  declarations: [
    MultipleAxisChartDefinitionDirective,
    MultipleAxisChartDefinitionComponent,
    BkMultipleAxisChartComponent
  ],
  entryComponents: [MultipleAxisChartDefinitionComponent],
  providers: [
    createDefinitionProvider(multipleAxisChartDefinition),
    createMetaDefinitionProvider(multipleAxisChartMetaDefinition)
  ]
})
export class MultipleAxisChartDefinitionModule {
}
