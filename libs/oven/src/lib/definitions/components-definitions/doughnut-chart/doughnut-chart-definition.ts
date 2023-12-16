import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { BkDoughnutChartComponent } from './doughnut-chart.component';

type DoughnutChartDefinitionContext = DefinitionContext<BkDoughnutChartComponent>;

@Directive({ selector: '[ovenDoughnutChartDefinition]' })
export class DoughnutChartDefinitionDirective {
  @Input('ovenDoughnutChartDefinition') set context(context: DoughnutChartDefinitionContext) {
    context.view = {
      instance: this.chart,
      slots: null,
      element: this.element
    };
    this.actionsDirective.listen(() => null);
  }

  constructor(
    public chart: BkDoughnutChartComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector: 'oven-doughnut-chart-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <oven-doughnut-chart
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenDoughnutChartDefinition]="context"
    >
    </oven-doughnut-chart>
  `
})
export class DoughnutChartDefinitionComponent implements ComponentDefinition<DoughnutChartDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<DoughnutChartDefinitionContext>;
}
