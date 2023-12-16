import { Directive, HostListener, Input, OnDestroy } from '@angular/core';
import { VirtualComponent } from '../../../model';

import { RenderState } from '../../../state/render-state.service';

@Directive({ selector: '[ovenBreadcrumbsHover]' })
export class BreadcrumbsHoverDirective implements OnDestroy {
  @Input() ovenBreadcrumbsHover: VirtualComponent;

  constructor(private renderState: RenderState) {
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.renderState.highlightBreadcrumb(this.ovenBreadcrumbsHover);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.renderState.highlightBreadcrumb(null);
  }

  ngOnDestroy() {
    this.renderState.highlightBreadcrumb(null);
  }
}
