import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';
import { ProgressComponent } from '@gradii/triangle/progress';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';

type ProgressBarDefinitionContext = DefinitionContext<ProgressComponent>;

@Directive({ selector: '[kitchenProgressBarDefinition]' })
export class ProgressBarDefinitionDirective {
  @Input('kitchenProgressBarDefinition') set view(context: ProgressBarDefinitionContext) {
    context.view = {
      instance: this.progressBar,
      slots   : null,
      element : this.element
    };
  }

  constructor(public progressBar: ProgressComponent, public element: ElementRef) {
  }
}

@Component({
  selector       : 'kitchen-progress-bar-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-progress
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenProgressBarDefinition]="context"
    >
    </tri-progress>
  `
})
export class ProgressBarDefinitionComponent implements ComponentDefinition<ProgressBarDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<ProgressBarDefinitionContext>;
}
