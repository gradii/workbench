import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';

type DividerDefinitionContext = DefinitionContext<null>;

@Directive({ selector: '[kitchenDividerDefinition]' })
export class DividerDefinitionDirective {
  @Input('kitchenDividerDefinition') set context(context: DividerDefinitionContext) {
    context.view = {
      instance: {} as any,
      slots: null,
      element: this.element
    };
  }

  constructor(public element: ElementRef) {
  }
}

@Component({
  selector: 'kitchen-divider-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #divider
      class="divider"
      *kitchenDefinition="let context"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithBackground]="context.view?.instance.background"
      [kitchenWithSizeMargins]="context.view?.instance.margins"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenDividerHelper]="context.view?.instance.direction"
      [kitchenDividerDefinition]="context"
    ></div>
  `
})
export class DividerDefinitionComponent implements ComponentDefinition<DividerDefinitionDirective> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<DividerDefinitionDirective>;
}
