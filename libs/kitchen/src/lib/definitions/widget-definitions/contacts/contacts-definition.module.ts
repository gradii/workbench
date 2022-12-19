import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';
import { contactsFactory } from './contacts.factory';
import { CardComponent } from '@gradii/triangle/card';

const metaDefinition: WidgetMetaDefinition = {
  definition: {
    id: 'card',
    componentType: CardComponent,
    definition: CardDefinitionComponent,
    factory: contactsFactory
  },
  name: 'Contacts',
  icon: '',
  order: 350,
  previewImage: 'assets/widgets/contacts.png',
  headerSupport: false,
  sidebarSupport: false,
  tags: ['users', 'list']
};

@NgModule({
  imports: [CommonModule],
  providers: [createWidgetMetaDefinitionProvider(metaDefinition)]
})
export class ContactsDefinitionModule {
}
