import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardComponent } from '@gradii/triangle/card';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { login3Factory } from './login-3.factory';

const metaDefinition: WidgetMetaDefinition = {
  definition: {
    id: 'card',
    componentType: CardComponent,
    definition: CardDefinitionComponent,
    factory: login3Factory
  },
  name: 'Login 3',
  icon: '',
  order: 600,
  previewImage: 'assets/widgets/login-3.png',
  headerSupport: false,
  sidebarSupport: false,
  tags: ['auth', 'form']
};

@NgModule({
  imports: [CommonModule],
  providers: [createWidgetMetaDefinitionProvider(metaDefinition)]
})
export class Login3DefinitionModule {
}
