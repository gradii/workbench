import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { BkDoughnutChartComponent } from './doughnut-chart.component';

type DoughnutChartDefinitionContext = DefinitionContext<BkDoughnutChartComponent>;

@Directive({ selector: '[kitchenDoughnutChartDefinition]' })
export class DoughnutChartDefinitionDirective {
  @Input('kitchenDoughnutChartDefinition') set context(context: DoughnutChartDefinitionContext) {
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
  selector: 'kitchen-doughnut-chart-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kitchen-doughnut-chart
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithSizeMargins]="context.view?.instance.margins"
      [kitchenWithActions]="context.view?.instance.actions"
      [kitchenDoughnutChartDefinition]="context"
    >
    </kitchen-doughnut-chart>
  `
})
export class DoughnutChartDefinitionComponent implements ComponentDefinition<DoughnutChartDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<DoughnutChartDefinitionContext>;
}
