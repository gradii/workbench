import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardComponent } from '@gradii/triangle/card';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { statusChartFactory } from './status-chart.factory';

const metaDefinition: WidgetMetaDefinition = {
  definition: {
    id: 'card',
    componentType: CardComponent,
    definition: CardDefinitionComponent,
    factory: statusChartFactory
  },
  name: 'Status Chart',
  icon: '',
  order: 1300,
  previewImage: 'assets/widgets/status-chart.png',
  headerSupport: false,
  sidebarSupport: false,
  tags: []
};

@NgModule({
  imports: [CommonModule],
  providers: [createWidgetMetaDefinitionProvider(metaDefinition)]
})
export class StatusChartDefinitionModule {
}
