import { Inject, Injectable } from '@angular/core';
import { NB_DOCUMENT } from '@nebular/theme';

@Injectable()
export class MockChatInstance {
  open() {
    console.info('Mock Chat: Open');
  }

  close() {
    console.info('Mock Chat: Close');
  }

  hide() {
    console.info('Mock Chat: Hide');
  }

  show() {
    console.info('Mock Chat: Show');
  }
}

@Injectable()
export class ChatInstance {
  private chatWidth = 0;

  constructor(@Inject(NB_DOCUMENT) private document) {
  }

  open() {
    const chat = this.getInstance();
    if (chat) {
      chat.open();
    }
  }

  close() {
    const chat = this.getInstance();
    if (chat) {
      chat.close();
    }
  }

  hide() {
    const chatEl = this.getChatElement();
    if (chatEl) {
      this.chatWidth = chatEl.style.width;
      chatEl.style.width = 0;
    }
  }

  show() {
    const chatEl = this.getChatElement();
    if (chatEl) {
      chatEl.style.width = this.chatWidth;
    }
  }

  private getChatElement() {
    return this.document.getElementById('hubspot-messages-iframe-container');
  }

  private getInstance() {
    return (window as any).HubSpotConversations.widget;
  }
}

@Injectable()
export class ChatService {
  private isOpen = false;

  constructor(private chat: ChatInstance) {
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.chat.open();
  }

  close() {
    this.isOpen = false;
    this.chat.close();
  }

  hide() {
    this.chat.hide();
  }

  show() {
    this.chat.show();
  }
}
