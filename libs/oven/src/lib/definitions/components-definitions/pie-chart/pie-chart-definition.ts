import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { BkPieChartComponent } from './pie-chart.component';

type PieChartDefinitionContext = DefinitionContext<BkPieChartComponent>;

@Directive({ selector: '[ovenPieChartDefinition]' })
export class PieChartDefinitionDirective {
  @Input('ovenPieChartDefinition') set context(context: PieChartDefinitionContext) {
    context.view = {
      instance: this.chart,
      slots: null,
      element: this.element
    };
    this.actionsDirective.listen(() => null);
  }

  constructor(
    public chart: BkPieChartComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector: 'oven-pie-chart-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <oven-pie-chart
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenPieChartDefinition]="context"
    >
    </oven-pie-chart>
  `
})
export class PieChartDefinitionComponent implements ComponentDefinition<PieChartDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<PieChartDefinitionContext>;
}
