import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbIconModule } from '@nebular/theme';
import { barChartSample, BreakpointWidth, nextComponentId, OvenComponent } from '@common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { BarChartDefinitionComponent, BarChartDefinitionDirective } from './bar-chart-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { BkBarChartComponent } from './bar-chart.component';
import { EchartsModule } from '../../../directives/echarts/echarts.module';
import { dataValidator } from './data-validator';
import { dataPropsFactory } from '../../../workflow/data/data-factory';

export function barChartFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'barChart',
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
      name: 'BarChart',
      ...dataPropsFactory(barChartSample)
    },
    actions: {
      init: []
    }
  };
}

const barChartDefinition: Definition = {
  id: 'barChart',
  componentType: BkBarChartComponent,
  definition: BarChartDefinitionComponent,
  factory: barChartFactory,
  dataTrigger: true,
  dataConsumer: true,
  dataValidator
};

const barChartMetaDefinition: MetaDefinition = {
  definition: barChartDefinition,
  name: 'Bar Chart',
  icon: 'bar-chart',
  order: 1400,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['graph', 'chart', 'bar', 'diagram', 'histogram']
};

@NgModule({
  imports: [DefinitionUtilsModule, CommonModule, EchartsModule, NbIconModule],
  exports: [BarChartDefinitionComponent],
  declarations: [BarChartDefinitionDirective, BarChartDefinitionComponent, BkBarChartComponent],
  entryComponents: [BarChartDefinitionComponent],
  providers: [createDefinitionProvider(barChartDefinition), createMetaDefinitionProvider(barChartMetaDefinition)]
})
export class BarChartDefinitionModule {
}
