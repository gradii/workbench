import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';
import { NbMenuComponent } from '@nebular/theme';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';

type MenuDefinitionContext = DefinitionContext<NbMenuComponent>;

@Directive({ selector: '[ovenMenuDefinition]' })
export class MenuDefinitionDirective {
  @Input('ovenMenuDefinition') set context(context: MenuDefinitionContext) {
    context.view = {
      instance: this.instance,
      slots: null,
      element: this.element
    };
  }

  constructor(public element: ElementRef, public instance: NbMenuComponent) {
  }
}

@Component({
  selector: 'oven-menu-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-menu
      #menu
      *ovenDefinition="let context"
      [ovenWithMenuDisabled]="context.devUIEnabled$"
      [items]="context.view?.instance.items || []"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithMargins]="context.view?.instance.margins"
      [ngClass]="getMenuColorClass(context.view?.instance.color)"
      [ovenMenuDefinition]="context"
    >
    </nb-menu>
  `
})
export class MenuDefinitionComponent implements ComponentDefinition<MenuDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<MenuDefinitionContext>;

  getMenuColorClass(color: string): string {
    if (color === 'basic') {
      return '';
    }

    return `menu-text-${color}`;
  }
}
