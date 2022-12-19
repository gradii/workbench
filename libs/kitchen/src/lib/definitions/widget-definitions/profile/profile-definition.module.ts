import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardComponent } from '@gradii/triangle/card';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { profileFactory } from './profile.factory';

const metaDefinition: WidgetMetaDefinition = {
  definition: {
    id: 'card',
    componentType: CardComponent,
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
