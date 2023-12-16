import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { BkMapComponent } from './map.component';

type MapDefinitionContext = DefinitionContext<BkMapComponent>;

@Directive({ selector: '[ovenMapDefinition]' })
export class MapDefinitionDirective {
  @Input('ovenMapDefinition') set context(context: MapDefinitionContext) {
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
  selector: 'oven-map-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <oven-map
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenMapDefinition]="context"
    >
    </oven-map>
  `
})
export class MapDefinitionComponent implements ComponentDefinition<MapDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<MapDefinitionContext>;
}
