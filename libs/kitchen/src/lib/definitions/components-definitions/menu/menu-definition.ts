import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';
import { TriMenu } from '@gradii/triangle/menu';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';

type MenuDefinitionContext = DefinitionContext<TriMenu>;

@Directive({ selector: '[kitchenMenuDefinition]' })
export class MenuDefinitionDirective {
  @Input('kitchenMenuDefinition')
  set context(context: MenuDefinitionContext) {
    context.view = {
      instance: this.instance,
      slots: null,
      element: this.element
    };
  }

  constructor(public element: ElementRef, public instance: TriMenu) {
  }
}

@Component({
  selector: 'kitchen-menu-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tri-menu
      #menu
      *kitchenDefinition="let context"
      [kitchenWithMenuDisabled]="context.devUIEnabled$"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithSizeMargins]="context.view?.instance.margins"
      [kitchenWithMargins]="context.view?.instance.margins"
      [ngClass]="getMenuColorClass(context.view?.instance.color)"
      [kitchenMenuDefinition]="context"
    >
    </tri-menu>
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
