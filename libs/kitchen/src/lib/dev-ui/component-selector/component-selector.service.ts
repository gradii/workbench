import { Overlay } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { LayoutHelper } from '../../util/layout-helper.service';
import { ComponentSpecificDevUI } from '../component-specific-dev-ui';
import { DevUIElementRef } from '../dev-ui-ref';
import { OverlayPositionBuilderService } from '../overlay-position';
import { isSpace } from '../util';
import { ComponentSelectorElementRef } from './component-selector-element-ref';

@Injectable()
export class ComponentSelectorService {
  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private layoutHelper: LayoutHelper,
    private componentSpecificDevUI: ComponentSpecificDevUI,
    private state: RenderState
  ) {
  }

  attach(): void {
    this.componentSpecificDevUI.create((virtualComponent: FlourComponent) => this.createDevUI(virtualComponent));
  }

  private createDevUI(virtualComponent: FlourComponent): DevUIElementRef {
    if (!isSpace(virtualComponent)) {
      return;
    }

    return new ComponentSelectorElementRef(
      this.overlay,
      this.overlayPositionBuilder,
      this.state,
      this.layoutHelper,
      virtualComponent
    );
  }
}
