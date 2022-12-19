import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { BkMultipleAxisChartComponent } from './multiple-axis-chart.component';

type MultipleAxisDefinitionContext = DefinitionContext<BkMultipleAxisChartComponent>;

@Directive({ selector: '[kitchenMultipleAxisChartDefinition]' })
export class MultipleAxisChartDefinitionDirective {
  @Input('kitchenMultipleAxisChartDefinition') set context(context: MultipleAxisDefinitionContext) {
    context.view = {
      instance: this.chart,
      slots: null,
      element: this.element
    };
    this.actionsDirective.listen(() => null);
  }

  constructor(
    public chart: BkMultipleAxisChartComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector: 'kitchen-multiple-axis-chart-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kitchen-multiple-axis-chart
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithSizeMargins]="context.view?.instance.margins"
      [kitchenWithActions]="context.view?.instance.actions"
      [kitchenMultipleAxisChartDefinition]="context"
    >
    </kitchen-multiple-axis-chart>
  `
})
export class MultipleAxisChartDefinitionComponent implements ComponentDefinition<MultipleAxisDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<MultipleAxisDefinitionContext>;
}
