import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardComponent } from '@nebular/theme';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';
import { multiColumnFormFactory } from './multi-column-form.factory';

const metaDefinition: WidgetMetaDefinition = {
  definition: {
    id: 'card',
    componentType: NbCardComponent,
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
