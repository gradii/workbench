import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardComponent } from '@gradii/triangle/card';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { statusChart2Factory } from './status-chart-2.factory';

const metaDefinition: WidgetMetaDefinition = {
  definition: {
    id: 'card',
    componentType: CardComponent,
    definition: CardDefinitionComponent,
    factory: statusChart2Factory
  },
  name: 'Status Chart 2',
  icon: '',
  order: 1400,
  previewImage: 'assets/widgets/status-chart-2.png',
  headerSupport: false,
  sidebarSupport: false,
  tags: []
};

@NgModule({
  imports: [CommonModule],
  providers: [createWidgetMetaDefinitionProvider(metaDefinition)]
})
export class StatusChart2DefinitionModule {
}
