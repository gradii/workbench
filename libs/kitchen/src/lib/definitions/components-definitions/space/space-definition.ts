import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, SlotDirective } from '../../definition-utils';
import { appearAnimation } from './appear-animation';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type SpaceDefinitionContext = DefinitionContext<SpaceDirective>;

@Directive({ selector: '[kitchenSpace]' })
export class SpaceDirective {
}

@Directive({ selector: '[kitchenSpaceSlot]' })
export class SpaceSlotDirective extends SlotDirective {
}

@Directive({ selector: '[kitchenSpaceDefinition]' })
export class SpaceDefinitionDirective {
  @Input('kitchenSpaceDefinition') set view(context: SpaceDefinitionContext) {
    context.view = {
      instance: this.space,
      slots: { content: this.contentSlot },
      element: this.element
    };
    this.actionsDirective.listen((eventType: string, callback: (value: any) => void) => {
      if (eventType === 'click') {
        return this.renderer.listen(this.element.nativeElement, 'click', () => {
          callback(undefined);
        });
      }
    });
  }

  constructor(
    public space: SpaceDirective,
    public element: ElementRef,
    public contentSlot: SpaceSlotDirective,
    private actionsDirective: WithActionsDirective,
    private renderer: Renderer2
  ) {
  }
}

@Component({
  selector: 'kitchen-space-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./space-definition.scss'],
  template: `
    <div
      class="space"
      cdkScrollable
      *kitchenDefinition="let context"
      [@appearAnimation]="isAnimationRequired(context)"
      [class.direction-row]="context.view?.instance.direction === 'row'"
      [class.direction-column]="context.view?.instance.direction === 'column'"
      [style.overflowX]="context.view?.instance.overflowX"
      [style.overflowY]="context.view?.instance.overflowY"
      [kitchenWithSpaceHeight]="context.view?.instance.height"
      [kitchenWithSpaceWidth]="context.view?.instance.width"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithPaddings]="context.view?.instance.paddings"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithActions]="context.view?.instance.actions"
      [style.justifyContent]="context.view?.instance.justify"
      [style.alignContent]="context.view?.instance.align"
      [style.alignItems]="context.view?.instance.align"
      [kitchenWithBackground]="context.view?.instance.background"
      kitchenSpace
      kitchenSpaceSlot
      [kitchenSpaceDefinition]="context"
      triDropFlexContainer
    >
      <ng-template kitchenSlotPlaceholder></ng-template>
    </div>
  `,
  animations: [appearAnimation]
})
export class SpaceDefinitionComponent implements ComponentDefinition<SpaceDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<SpaceDefinitionContext>;

  isAnimationRequired(context: SpaceDefinitionContext): string {
    if (
      context.syncReason &&
      context.syncReason.reason === 'paste' &&
      context.syncReason.data.componentId &&
      context.syncReason.data.componentId === context.component.id
    ) {
      return 'animate';
    }
    return '';
  }
}
