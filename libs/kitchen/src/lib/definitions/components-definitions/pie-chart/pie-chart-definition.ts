import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { BkPieChartComponent } from './pie-chart.component';

type PieChartDefinitionContext = DefinitionContext<BkPieChartComponent>;

@Directive({ selector: '[kitchenPieChartDefinition]' })
export class PieChartDefinitionDirective {
  @Input('kitchenPieChartDefinition') set context(context: PieChartDefinitionContext) {
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
  selector: 'kitchen-pie-chart-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kitchen-pie-chart
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithSizeMargins]="context.view?.instance.margins"
      [kitchenWithActions]="context.view?.instance.actions"
      [kitchenPieChartDefinition]="context"
    >
    </kitchen-pie-chart>
  `
})
export class PieChartDefinitionComponent implements ComponentDefinition<PieChartDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<PieChartDefinitionContext>;
}
