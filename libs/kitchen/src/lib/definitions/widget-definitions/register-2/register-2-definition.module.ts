import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardComponent } from '@gradii/triangle/card';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { register2Factory } from './register-2.factory';

const metaDefinition: WidgetMetaDefinition = {
  definition: {
    id: 'card',
    componentType: CardComponent,
    definition: CardDefinitionComponent,
    factory: register2Factory
  },
  name: 'Register 2',
  icon: '',
  order: 500,
  previewImage: 'assets/widgets/register-2.png',
  headerSupport: false,
  sidebarSupport: false,
  tags: ['auth', 'form']
};

@NgModule({
  imports: [CommonModule],
  providers: [createWidgetMetaDefinitionProvider(metaDefinition)]
})
export class Register2DefinitionModule {
}
