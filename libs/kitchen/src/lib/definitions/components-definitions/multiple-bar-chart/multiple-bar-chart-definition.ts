import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { BkMultipleBarChartComponent } from './multiple-bar-chart.component';

type MultipleBarChartDefinitionContext = DefinitionContext<BkMultipleBarChartComponent>;

@Directive({ selector: '[kitchenMultipleBarChartDefinition]' })
export class MultipleBarChartDefinitionDirective {
  @Input('kitchenMultipleBarChartDefinition') set context(context: MultipleBarChartDefinitionContext) {
    context.view = {
      instance: this.chart,
      slots: null,
      element: this.element
    };
    this.actionsDirective.listen(() => null);
  }

  constructor(
    public chart: BkMultipleBarChartComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector: 'kitchen-multi-bar-chart-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kitchen-multiple-bar-chart
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithSizeMargins]="context.view?.instance.margins"
      [kitchenWithActions]="context.view?.instance.actions"
      [kitchenMultipleBarChartDefinition]="context"
    >
    </kitchen-multiple-bar-chart>
  `
})
export class MultipleBarChartDefinitionComponent implements ComponentDefinition<MultipleBarChartDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<MultipleBarChartDefinitionContext>;
}
