import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';
import { NbChatComponent } from '@nebular/theme';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';

type ChatDefinitionContext = DefinitionContext<NbChatComponent>;

@Directive({ selector: '[ovenChatDefinition]' })
export class ChatDefinitionDirective {
  @Input('ovenChatDefinition') set view(context: ChatDefinitionContext) {
    context.view = {
      instance: this.chat,
      slots: null,
      element: this.element
    };
  }

  constructor(public chat: NbChatComponent, public element: ElementRef) {
  }
}

@Component({
  selector: 'oven-chat-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-chat
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenChatDefinition]="context"
    >
    </nb-chat>
  `
})
export class ChatDefinitionComponent implements ComponentDefinition<ChatDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<ChatDefinitionContext>;
}
