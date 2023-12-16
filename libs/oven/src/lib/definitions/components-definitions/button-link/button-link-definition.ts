import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';
import { NbButtonComponent } from '@nebular/theme';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';

type ButtonLinkDefinitionContext = DefinitionContext<NbButtonComponent>;

@Directive({ selector: '[ovenButtonLinkDefinition]' })
export class ButtonLinkDefinitionDirective {
  @Input('ovenButtonLinkDefinition') set context(context: ButtonLinkDefinitionContext) {
    context.view = {
      instance: this.buttonLink,
      slots: null,
      element: this.element
    };
  }

  constructor(public buttonLink: NbButtonComponent, public element: ElementRef) {
  }
}

@Component({
  selector: 'oven-button-link-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      nbButton
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      draggable="false"
      [fullWidth]="context.view?.instance.width.type === 'full'"
      [ovenWithFormFieldWidth]="context.view?.instance.width"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithDisabled]="context.view?.instance.ovenDisabled"
      [ovenWithNavigation]="context.view?.instance.url"
      [navigationDisabled]="context.devUIEnabled$"
      [ovenButtonLinkDefinition]="context"
    >
      <nb-icon
        *ngIf="context.view?.instance.iconPlacement === 'left' || context.view?.instance.iconPlacement === 'center'"
        [icon]="context.view?.instance.icon"
      >
      </nb-icon>
      <ng-template [ngIf]="context.view?.instance.iconPlacement !== 'center'">
        {{ context.view?.instance.text }}
      </ng-template>
      <nb-icon *ngIf="context.view?.instance.iconPlacement === 'right'" [icon]="context.view?.instance.icon"></nb-icon>
    </a>
  `
})
export class ButtonLinkDefinitionComponent implements ComponentDefinition<ButtonLinkDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<ButtonLinkDefinitionContext>;
}
