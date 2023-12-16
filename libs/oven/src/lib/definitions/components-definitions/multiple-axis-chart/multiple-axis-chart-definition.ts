import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { BkMultipleAxisChartComponent } from './multiple-axis-chart.component';

type MultipleAxisDefinitionContext = DefinitionContext<BkMultipleAxisChartComponent>;

@Directive({ selector: '[ovenMultipleAxisChartDefinition]' })
export class MultipleAxisChartDefinitionDirective {
  @Input('ovenMultipleAxisChartDefinition') set context(context: MultipleAxisDefinitionContext) {
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
  selector: 'oven-multiple-axis-chart-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <oven-multiple-axis-chart
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenMultipleAxisChartDefinition]="context"
    >
    </oven-multiple-axis-chart>
  `
})
export class MultipleAxisChartDefinitionComponent implements ComponentDefinition<MultipleAxisDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<MultipleAxisDefinitionContext>;
}
