import { Overlay } from '@angular/cdk/overlay';
import { Injectable, NgZone } from '@angular/core';
import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { LayoutHelper } from '../../util/layout-helper.service';
import { ComponentSpecificDevUI } from '../component-specific-dev-ui';
import { DevUIElementRef } from '../dev-ui-ref';
import { OverlayPositionBuilderService } from '../overlay-position';
import { ActionsElementRef } from './actions-element-ref';


@Injectable(/*{ providedIn: 'root' }*/)
export class ActionsService {
  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState,
    private ngZone: NgZone,
    private componentSpecificDevUI: ComponentSpecificDevUI,
    private layoutHelper: LayoutHelper
  ) {
  }

  attach(): void {
    this.componentSpecificDevUI.create(
      (virtualComponent: FlourComponent) => this.createDevUI(virtualComponent));
  }

  private createDevUI(virtualComponent: FlourComponent): DevUIElementRef {
    return new ActionsElementRef(
      this.overlay,
      this.overlayPositionBuilder,
      this.state,
      this.ngZone,
      this.layoutHelper,
      virtualComponent
    );
  }
}
