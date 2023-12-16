import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointWidth, lineChartSample, nextComponentId, OvenComponent } from '@common';

import { createDefinitionProvider, createMetaDefinitionProvider, Definition, MetaDefinition } from '../../definition';
import { LineChartDefinitionComponent, LineChartDefinitionDirective } from './line-chart-definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { BkLineChartComponent } from './line-chart.component';
import { EchartsModule } from '../../../directives/echarts/echarts.module';
import { dataValidator } from './data-validator';
import { dataPropsFactory } from '../../../workflow/data/data-factory';
import { NbIconModule } from '@nebular/theme';

export function lineChartFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'lineChart',
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
      name: 'LineChart',
      ...dataPropsFactory(lineChartSample)
    },
    actions: {
      init: []
    }
  };
}

const lineChartDefinition: Definition = {
  id: 'lineChart',
  componentType: BkLineChartComponent,
  definition: LineChartDefinitionComponent,
  factory: lineChartFactory,
  dataTrigger: true,
  dataConsumer: true,
  dataValidator
};

const lineChartMetaDefinition: MetaDefinition = {
  definition: lineChartDefinition,
  name: 'Line Chart',
  icon: 'line-chart',
  order: 1300,
  headerSupport: false,
  sidebarSupport: false,
  tags: ['graph', 'chart', 'diagram', 'histogram']
};

@NgModule({
  imports: [DefinitionUtilsModule, CommonModule, EchartsModule, NbIconModule],
  exports: [LineChartDefinitionComponent],
  declarations: [LineChartDefinitionDirective, LineChartDefinitionComponent, BkLineChartComponent],
  entryComponents: [LineChartDefinitionComponent],
  providers: [createDefinitionProvider(lineChartDefinition), createMetaDefinitionProvider(lineChartMetaDefinition)]
})
export class LineChartDefinitionModule {
}
