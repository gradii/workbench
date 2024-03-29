import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardComponent } from '@nebular/theme';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';
import { profileFactory } from './profile.factory';

const metaDefinition: WidgetMetaDefinition = {
  definition: {
    id: 'card',
    componentType: NbCardComponent,
    definition: CardDefinitionComponent,
    factory: profileFactory
  },
  name: 'Profile',
  icon: '',
  order: 700,
  previewImage: 'assets/widgets/profile.png',
  headerSupport: false,
  sidebarSupport: false,
  tags: ['auth', 'form', 'user', 'profile']
};

@NgModule({
  imports: [CommonModule],
  providers: [createWidgetMetaDefinitionProvider(metaDefinition)]
})
export class ProfileDefinitionModule {
}
