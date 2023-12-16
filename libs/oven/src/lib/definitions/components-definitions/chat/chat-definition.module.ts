import { NgModule } from '@angular/core';
import { NbChatComponent, NbChatModule } from '@nebular/theme';
import { nextComponentId, OvenComponent } from '@common';

import { createDefinitionProvider, Definition } from '../../definition';
import { DefinitionUtilsModule } from '../../definition-utils';
import { ChatDefinitionComponent, ChatDefinitionDirective } from './chat-definition';

export function chatFactory(): OvenComponent {
  return {
    id: nextComponentId(),
    definitionId: 'chat',
    styles: {},
    properties: {}
  };
}

const chatDefinition: Definition = {
  id: 'chat',
  componentType: NbChatComponent,
  definition: ChatDefinitionComponent,
  factory: chatFactory
};

@NgModule({
  imports: [DefinitionUtilsModule, NbChatModule],
  exports: [ChatDefinitionComponent],
  declarations: [ChatDefinitionDirective, ChatDefinitionComponent],
  entryComponents: [ChatDefinitionComponent],
  providers: [createDefinitionProvider(chatDefinition)]
})
export class ChatDefinitionModule {
}
