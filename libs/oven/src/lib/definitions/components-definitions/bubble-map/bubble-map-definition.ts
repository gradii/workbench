import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { BkBubbleMapComponent } from './bubble-map.component';

type BubbleMapDefinitionContext = DefinitionContext<BkBubbleMapComponent>;

@Directive({ selector: '[ovenBubbleMapDefinition]' })
export class BubbleMapDefinitionDirective {
  @Input('ovenBubbleMapDefinition') set context(context: BubbleMapDefinitionContext) {
    context.view = {
      instance: this.chart,
      slots: null,
      element: this.element
    };
    this.actionsDirective.listen(() => null);
  }

  constructor(
    public chart: BkBubbleMapComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector: 'oven-bubble-map-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <oven-bubble-map
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenBubbleMapDefinition]="context"
    >
    </oven-bubble-map>
  `
})
export class BubbleMapDefinitionComponent implements ComponentDefinition<BubbleMapDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<BubbleMapDefinitionContext>;
}
