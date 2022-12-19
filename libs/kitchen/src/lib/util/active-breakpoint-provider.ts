import { Injectable } from '@angular/core';
import { ActiveBreakpointProvider, BreakpointWidth } from '@common/public-api';
import { RenderState } from '../state/render-state.service';

@Injectable()
export class KitchenActiveBreakpointProvider extends ActiveBreakpointProvider {
  private activeBreakpoint: BreakpointWidth = BreakpointWidth.Desktop;

  constructor(private renderState: RenderState) {
    super();
    this.renderState.activeBreakpoint$.subscribe(breakpoint => (this.activeBreakpoint = breakpoint));
  }

  getActiveBreakpoint(): BreakpointWidth {
    return this.activeBreakpoint;
  }
}
