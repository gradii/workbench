import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardComponent } from '@gradii/triangle/card';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { multiColumnFormFactory } from './multi-column-form.factory';

const metaDefinition: WidgetMetaDefinition = {
  definition: {
    id: 'card',
    componentType: CardComponent,
    definition: CardDefinitionComponent,
    factory: multiColumnFormFactory
  },
  name: 'Multi Column Form',
  icon: '',
  order: 1100,
  previewImage: 'assets/widgets/multi-column-form.png',
  headerSupport: false,
  sidebarSupport: false,
  tags: ['form', 'user', 'profile']
};

@NgModule({
  imports: [CommonModule],
  providers: [createWidgetMetaDefinitionProvider(metaDefinition)]
})
export class MultiColumnFormDefinitionModule {
}
