import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardComponent } from '@nebular/theme';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';
import { loginFactory } from './login.factory';

const metaDefinition: WidgetMetaDefinition = {
  definition: {
    id: 'card',
    componentType: NbCardComponent,
    definition: CardDefinitionComponent,
    factory: loginFactory
  },
  name: 'Login',
  icon: '',
  order: 100,
  previewImage: 'assets/widgets/login.png',
  headerSupport: false,
  sidebarSupport: false,
  tags: ['auth', 'form']
};

@NgModule({
  imports: [CommonModule],
  providers: [createWidgetMetaDefinitionProvider(metaDefinition)]
})
export class LoginDefinitionModule {
}
