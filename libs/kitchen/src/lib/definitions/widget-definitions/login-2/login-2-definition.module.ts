import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardComponent } from '@gradii/triangle/card';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { login2Factory } from './login-2.factory';

const metaDefinition: WidgetMetaDefinition = {
  definition: {
    id: 'card',
    componentType: CardComponent,
    definition: CardDefinitionComponent,
    factory: login2Factory
  },
  name: 'Login 2',
  icon: '',
  order: 400,
  previewImage: 'assets/widgets/login-2.png',
  headerSupport: false,
  sidebarSupport: false,
  tags: ['auth', 'form']
};

@NgModule({
  imports: [CommonModule],
  providers: [createWidgetMetaDefinitionProvider(metaDefinition)]
})
export class Login2DefinitionModule {
}
