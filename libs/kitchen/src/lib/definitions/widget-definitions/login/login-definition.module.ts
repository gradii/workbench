import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardComponent } from '@gradii/triangle/card';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { loginFactory } from './login.factory';

const metaDefinition: WidgetMetaDefinition = {
  definition    : {
    id           : 'card',
    componentType: CardComponent,
    definition   : CardDefinitionComponent,
    factory      : loginFactory
  },
  name          : 'Login',
  icon          : '',
  order         : 100,
  previewImage  : 'assets/widgets/login.png',
  headerSupport : false,
  sidebarSupport: false,
  tags          : ['auth', 'form']
};

@NgModule({
  imports  : [CommonModule],
  providers: [createWidgetMetaDefinitionProvider(metaDefinition)]
})
export class LoginDefinitionModule {
}
