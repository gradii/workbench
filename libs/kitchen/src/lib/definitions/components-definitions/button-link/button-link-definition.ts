import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import { ButtonComponent } from '@gradii/triangle/button';

import { DefinitionContext } from '../../definition';
import {
  ComponentDefinition,
  DefinitionDirective
} from '../../definition-utils';

type ButtonLinkDefinitionContext = DefinitionContext<ButtonComponent>;

@Directive({ selector: '[kitchenButtonLinkDefinition]' })
export class ButtonLinkDefinitionDirective {
  @Input('kitchenButtonLinkDefinition') set context(context: ButtonLinkDefinitionContext) {
    context.view = {
      instance: this.buttonLink,
      slots   : null,
      element : this.element
    };
  }

  constructor(public buttonLink: ButtonComponent,
              public element: ElementRef) {
  }
}

@Component({
  selector       : 'kitchen-button-link-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <a
      triButton
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      draggable="false"
      [kitchenWithFormFieldWidth]="context.view?.instance.width"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithDisabled]="context.view?.instance.kitchenDisabled"
      [kitchenWithNavigation]="context.view?.instance.url"
      [navigationDisabled]="context.devUIEnabled$"
      [kitchenButtonLinkDefinition]="context"
    >
      <tri-icon
        *ngIf="context.view?.instance.iconPlacement === 'left' || context.view?.instance.iconPlacement === 'center'"
        [svgIcon]="context.view?.instance.icon"
      >
      </tri-icon>
      <ng-template [ngIf]="context.view?.instance.iconPlacement !== 'center'">
        {{ context.view?.instance.text }}
      </ng-template>
      <tri-icon *ngIf="context.view?.instance.iconPlacement === 'right'"
                [svgIcon]="context.view?.instance.icon"></tri-icon>
    </a>
  `
})
export class ButtonLinkDefinitionComponent implements ComponentDefinition<ButtonLinkDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<ButtonLinkDefinitionContext>;
}
