import { ElementRef, Directive, Input } from '@angular/core';

import { ClosableInstance, OverlayDetachHandlerService } from './overlay-detach-handler.service';

@Directive({ selector: '[ubOverlayRegister]' })
export class OverlayRegisterDirective {
  constructor(private handler: OverlayDetachHandlerService, private el: ElementRef) {
  }

  private registered = false;

  @Input() set ubOverlayRegister(instance: ClosableInstance) {
    if (instance) {
      this.register(instance);
    }
  }

  private register(instance) {
    if (!this.registered) {
      this.registered = true;
      this.handler.register(instance, this.el);
    }
  }
}
