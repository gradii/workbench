import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { BkBarChartComponent } from './bar-chart.component';

type BarChartDefinitionContext = DefinitionContext<BkBarChartComponent>;

@Directive({ selector: '[ovenBarChartDefinition]' })
export class BarChartDefinitionDirective {
  @Input('ovenBarChartDefinition') set context(context: BarChartDefinitionContext) {
    context.view = {
      instance: this.chart,
      slots: null,
      element: this.element
    };
    this.actionsDirective.listen(() => null);
  }

  constructor(
    public chart: BkBarChartComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector: 'oven-bar-chart-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <oven-bar-chart
      *ovenDefinition="let context"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenBarChartDefinition]="context"
    >
    </oven-bar-chart>
  `
})
export class BarChartDefinitionComponent implements ComponentDefinition<BarChartDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<BarChartDefinitionContext>;
}
