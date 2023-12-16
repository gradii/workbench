import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { BkLineChartComponent } from './line-chart.component';

type LineChartDefinitionContext = DefinitionContext<BkLineChartComponent>;

@Directive({ selector: '[ovenLineChartDefinition]' })
export class LineChartDefinitionDirective {
  @Input('ovenLineChartDefinition') set context(context: LineChartDefinitionContext) {
    context.view = {
      instance: this.chart,
      slots: null,
      element: this.element
    };
    this.actionsDirective.listen(() => null);
  }

  constructor(
    public chart: BkLineChartComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector: 'oven-line-chart-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <oven-line-chart
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenLineChartDefinition]="context"
    >
    </oven-line-chart>
  `
})
export class LineChartDefinitionComponent implements ComponentDefinition<LineChartDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<LineChartDefinitionContext>;
}
