import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';

type DividerDefinitionContext = DefinitionContext<null>;

@Directive({ selector: '[ovenDividerDefinition]' })
export class DividerDefinitionDirective {
  @Input('ovenDividerDefinition') set context(context: DividerDefinitionContext) {
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
  selector: 'oven-divider-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #divider
      class="divider"
      *ovenDefinition="let context"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithBackground]="context.view?.instance.background"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenDividerHelper]="context.view?.instance.direction"
      [ovenDividerDefinition]="context"
    ></div>
  `
})
export class DividerDefinitionComponent implements ComponentDefinition<DividerDefinitionDirective> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<DividerDefinitionDirective>;
}
