import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardComponent } from '@nebular/theme';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';
import { statusCardFactory } from './status-card.factory';

const metaDefinition: WidgetMetaDefinition = {
  definition: {
    id: 'card',
    componentType: NbCardComponent,
    definition: CardDefinitionComponent,
    factory: statusCardFactory
  },
  name: 'Status Card',
  icon: '',
  order: 1200,
  previewImage: 'assets/widgets/status-card.png',
  headerSupport: false,
  sidebarSupport: false,
  tags: []
};

@NgModule({
  imports: [CommonModule],
  providers: [createWidgetMetaDefinitionProvider(metaDefinition)]
})
export class StatusCardDefinitionModule {
}
