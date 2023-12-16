import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';

type IframeDefinitionContext = DefinitionContext<null>;

@Directive({ selector: '[ovenIframeDefinition]' })
export class IframeDefinitionDirective {
  @Input('ovenIframeDefinition') set context(context: IframeDefinitionContext) {
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
  selector: 'oven-iframe-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="iframe-wrapper"
      *ovenDefinition="let context"
      [class.empty]="!context.view?.instance.url"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenIframeDefinition]="context"
    >
      <iframe
        *ngIf="validUrl(context.view?.instance.url)"
        [src]="context.view?.instance.url | safe: 'resourceUrl'"
      ></iframe>
    </div>
  `
})
export class IframeDefinitionComponent implements ComponentDefinition<IframeDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<IframeDefinitionContext>;

  validUrl(url: string = '') {
    return url.match(/^https?:\/\/.+\..+/g);
  }
}
