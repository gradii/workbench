import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { DevUIElementRef } from '../dev-ui-ref';
import { ComponentSpecificDevUI } from '../component-specific-dev-ui';

class ChangeElementRef implements DevUIElementRef {
  constructor(private change: Subscription) {
  }

  dispose() {
    if (this.change) {
      this.change.unsubscribe();
    }
  }

  update() {
  }
}

@Injectable(/*{ providedIn: 'root' }*/)
export class ChangeListenerService {
  constructor(private state: RenderState, private componentSpecificDevUI: ComponentSpecificDevUI) {
  }

  attach(): void {
    this.componentSpecificDevUI.create((virtualComponent: FlourComponent) => this.createDevUI(virtualComponent));
  }

  private createDevUI(virtualComponent: FlourComponent): DevUIElementRef {
    let change = null;
    if (virtualComponent.view.properties$) {
      change = virtualComponent.view.properties$.subscribe(changes => {
        const component = virtualComponent.component;
        this.state.update(component.id, { ...component.properties, ...changes });
      });
    }
    return new ChangeElementRef(change);
  }
}
