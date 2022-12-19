import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { ButtonComponent } from '@gradii/triangle/button';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type ButtonDefinitionContext = DefinitionContext<ButtonComponent>;

@Directive({ selector: '[kitchenButtonDefinition]' })
export class ButtonDefinitionDirective {
  @Input('kitchenButtonDefinition') set context(context: ButtonDefinitionContext) {
    context.view = {
      instance: this.button,
      slots   : null,
      element : this.element
    };
    this.actionsDirective.listen((eventType: string, callback: (value: any) => void) => {
      if (eventType === 'click') {
        return this.renderer.listen(this.element.nativeElement, 'click', event => {
          callback(event);
        });
      }
    });
  }

  constructor(
    private renderer: Renderer2,
    public button: ButtonComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector       : 'kitchen-button-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <button
      triButton
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithFormFieldWidth]="context.view?.instance.width"
      [kitchenWithDisabled]="context.view?.instance.kitchenDisabled"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithActions]="context.view?.instance.actions"
      [kitchenButtonDefinition]="context"
      style="transition-property:none">
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
    </button>
  `
})
export class ButtonDefinitionComponent implements ComponentDefinition<ButtonDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<ButtonDefinitionContext>;
}
