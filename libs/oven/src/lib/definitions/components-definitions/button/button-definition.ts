import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
  ContentChild
} from '@angular/core';
import { NbButtonComponent } from '@nebular/theme';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type ButtonDefinitionContext = DefinitionContext<NbButtonComponent>;

@Directive({ selector: '[ovenButtonDefinition]' })
export class ButtonDefinitionDirective {
  @Input('ovenButtonDefinition') set context(context: ButtonDefinitionContext) {
    context.view = {
      instance: this.button,
      slots: null,
      element: this.element
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
    public button: NbButtonComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector: 'oven-button-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      nbButton
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [fullWidth]="context.view?.instance.width.type === 'full'"
      [ovenWithFormFieldWidth]="context.view?.instance.width"
      [ovenWithDisabled]="context.view?.instance.ovenDisabled"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenButtonDefinition]="context"
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
    </button>
  `
})
export class ButtonDefinitionComponent implements ComponentDefinition<ButtonDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<ButtonDefinitionContext>;
}
