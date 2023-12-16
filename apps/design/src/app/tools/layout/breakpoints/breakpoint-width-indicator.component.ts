import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ub-breakpoint-width-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./breakpoint-width-indicator.component.scss'],
  template: `{{ breakpointWidth }} <span class="px">&nbsp;px</span>`
})
export class BreakpointWidthIndicatorComponent {
  @Input() breakpointWidth: number;
}
