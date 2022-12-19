import { Overlay } from '@angular/cdk/overlay';
import { Injectable, NgZone } from '@angular/core';

import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { LayoutHelper } from '../../util/layout-helper.service';
import { ComponentSpecificDevUI } from '../component-specific-dev-ui';
import { DevUIElementRef } from '../dev-ui-ref';
import { DOMElementsService } from '../dom-elements.service';
import { OverlayPositionBuilderService } from '../overlay-position';
import { SelectHighlightElementRef } from './select-highlight-element-ref';


@Injectable(/*{ providedIn: 'root' }*/)
export class SelectHighlightService {
  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private layoutHelper: LayoutHelper,
    private domElementsService: DOMElementsService,
    private renderState: RenderState,
    private componentSpecificDevUI: ComponentSpecificDevUI,
    private _ngZone: NgZone
  ) {
  }

  attach(): void {
    this._ngZone.runOutsideAngular(() => {
      this.componentSpecificDevUI.create((virtualComponent: FlourComponent) => {
        return this._ngZone.run(() => this.createDevUI(virtualComponent));
      });
    });
  }

  private createDevUI(virtualComponent: FlourComponent): DevUIElementRef {
    return new SelectHighlightElementRef(
      this.overlay,
      this.overlayPositionBuilder,
      this.layoutHelper,
      virtualComponent,
      this.domElementsService,
      this.renderState,
    );
  }
}
