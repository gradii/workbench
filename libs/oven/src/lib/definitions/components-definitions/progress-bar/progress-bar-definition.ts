import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';
import { NbProgressBarComponent } from '@nebular/theme';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';

type ProgressBarDefinitionContext = DefinitionContext<NbProgressBarComponent>;

@Directive({ selector: '[ovenProgressBarDefinition]' })
export class ProgressBarDefinitionDirective {
  @Input('ovenProgressBarDefinition') set view(context: ProgressBarDefinitionContext) {
    context.view = {
      instance: this.progressBar,
      slots: null,
      element: this.element
    };
  }

  constructor(public progressBar: NbProgressBarComponent, public element: ElementRef) {
  }
}

@Component({
  selector: 'oven-progress-bar-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-progress-bar
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenProgressBarDefinition]="context"
    >
    </nb-progress-bar>
  `
})
export class ProgressBarDefinitionComponent implements ComponentDefinition<ProgressBarDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<ProgressBarDefinitionContext>;
}
