import { Overlay } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { filter, map, pairwise, startWith, tap } from 'rxjs/operators';

import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { DevUIElementRef } from '../dev-ui-ref';
import { OverlayPositionBuilderService } from '../overlay-position';
import { BreadcrumbsHoverHighlightElementRef } from './breadcrumbs-hover-highlight-element-ref';

@Injectable()
export class BreadcrumbsHoverService {
  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilderService,
    private state: RenderState
  ) {
  }

  attach(): void {
    this.state.breadcrumbsHighlightedComponent$
      .pipe(
        map((virtualComponent: FlourComponent) => this.createDevUI(virtualComponent)),
        startWith(null),
        pairwise(),
        map(([prev]: [DevUIElementRef, DevUIElementRef]) => prev),
        filter((ref: DevUIElementRef) => !!ref),
        tap((ref: DevUIElementRef) => ref.dispose())
      )
      .subscribe();
  }

  private createDevUI(virtualComponent: FlourComponent): DevUIElementRef {
    if (!virtualComponent) {
      return;
    }

    return new BreadcrumbsHoverHighlightElementRef(
      this.overlay,
      this.overlayPositionBuilder,
      this.state,
      virtualComponent
    );
  }
}
