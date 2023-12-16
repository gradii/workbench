import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { BkMultipleBarChartComponent } from './multiple-bar-chart.component';

type MultipleBarChartDefinitionContext = DefinitionContext<BkMultipleBarChartComponent>;

@Directive({ selector: '[ovenMultipleBarChartDefinition]' })
export class MultipleBarChartDefinitionDirective {
  @Input('ovenMultipleBarChartDefinition') set context(context: MultipleBarChartDefinitionContext) {
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
  selector: 'oven-multi-bar-chart-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <oven-multiple-bar-chart
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenMultipleBarChartDefinition]="context"
    >
    </oven-multiple-bar-chart>
  `
})
export class MultipleBarChartDefinitionComponent implements ComponentDefinition<MultipleBarChartDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<MultipleBarChartDefinitionContext>;
}
