import { Directive, HostListener, Input, OnDestroy } from '@angular/core';
import { FlourComponent } from '../../../model';

import { RenderState } from '../../../state/render-state.service';

@Directive({ selector: '[kitchenBreadcrumbsHover]' })
export class BreadcrumbsHoverDirective implements OnDestroy {
  @Input() kitchenBreadcrumbsHover: FlourComponent;

  constructor(private renderState: RenderState) {
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.renderState.highlightBreadcrumb(this.kitchenBreadcrumbsHover);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.renderState.highlightBreadcrumb(null);
  }

  ngOnDestroy() {
    this.renderState.highlightBreadcrumb(null);
  }
}
