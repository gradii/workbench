import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { BkMapComponent } from './map.component';

type MapDefinitionContext = DefinitionContext<BkMapComponent>;

@Directive({ selector: '[kitchenMapDefinition]' })
export class MapDefinitionDirective {
  @Input('kitchenMapDefinition') set context(context: MapDefinitionContext) {
    context.view = {
      instance: this.map,
      slots: null,
      element: this.element
    };
  }

  constructor(public map: BkMapComponent, public element: ElementRef) {
  }
}

@Component({
  selector: 'kitchen-map-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kitchen-map
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithSizeMargins]="context.view?.instance.margins"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenMapDefinition]="context"
    >
    </kitchen-map>
  `
})
export class MapDefinitionComponent implements ComponentDefinition<MapDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<MapDefinitionContext>;
}
