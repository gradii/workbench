import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';

type IframeDefinitionContext = DefinitionContext<null>;

@Directive({ selector: '[kitchenIframeDefinition]' })
export class IframeDefinitionDirective {
  @Input('kitchenIframeDefinition') set context(context: IframeDefinitionContext) {
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
  selector: 'kitchen-iframe-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="iframe-wrapper"
      *kitchenDefinition="let context"
      [class.empty]="!context.view?.instance.url"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithSizeMargins]="context.view?.instance.margins"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenIframeDefinition]="context"
    >
      <iframe
        *ngIf="validUrl(context.view?.instance.url)"
        [src]="context.view?.instance.url | pfSafe: 'resourceUrl'"
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
