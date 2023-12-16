import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';

type ImageDefinitionContext = DefinitionContext<null>;

@Directive({ selector: '[ovenImageDefinition]' })
export class ImageDefinitionDirective {
  @Input('ovenImageDefinition') set context(context: ImageDefinitionContext) {
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
  selector: 'oven-image-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img
      *ovenDefinition="let context"
      draggable="false"
      [src]="getUrl(context)"
      [ovenWithVisible]="context.view?.instance.visible"
      [style.objectFit]="context.view?.instance.fit"
      [ovenWithRadius]="context.view?.instance.radius"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenImageDefinition]="context"
    />
  `
})
export class ImageDefinitionComponent implements ComponentDefinition<ImageDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<ImageDefinitionContext>;

  defaultImagePath = 'assets/images/default.svg';

  getUrl(context): string {
    if (!context.view) {
      return this.defaultImagePath;
    }
    const source = context.view.instance.src;
    if (!source) {
      return this.defaultImagePath;
    }
    if (!source.uploadUrl && !source.url) {
      return this.defaultImagePath;
    }
    if (source.active === 'upload') {
      return source.uploadUrl ? source.uploadUrl : source.url;
    } else if (source.active === 'url') {
      return source.url ? source.url : source.uploadUrl;
    }
  }
}
