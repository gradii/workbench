import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, SlotDirective } from '../../definition-utils';
import { appearAnimation } from './appear-animation';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type SpaceDefinitionContext = DefinitionContext<SpaceDirective>;

@Directive({ selector: '[ovenSpace]' })
export class SpaceDirective {
}

@Directive({ selector: '[ovenSpaceSlot]' })
export class SpaceSlotDirective extends SlotDirective {
}

@Directive({ selector: '[ovenSpaceDefinition]' })
export class SpaceDefinitionDirective {
  @Input('ovenSpaceDefinition') set view(context: SpaceDefinitionContext) {
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
  selector: 'oven-space-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./space-definition.scss'],
  template: `
    <div
      class="space"
      cdkScrollable
      *ovenDefinition="let context"
      [@appearAnimation]="isAnimationRequired(context)"
      [class.direction-row]="context.view?.instance.direction === 'row'"
      [class.direction-column]="context.view?.instance.direction === 'column'"
      [style.overflowX]="context.view?.instance.overflowX"
      [style.overflowY]="context.view?.instance.overflowY"
      [ovenWithSpaceHeight]="context.view?.instance.height"
      [ovenWithSpaceWidth]="context.view?.instance.width"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithPaddings]="context.view?.instance.paddings"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithActions]="context.view?.instance.actions"
      [style.justifyContent]="context.view?.instance.justify"
      [style.alignContent]="context.view?.instance.align"
      [style.alignItems]="context.view?.instance.align"
      [ovenWithBackground]="context.view?.instance.background"
      ovenSpace
      ovenSpaceSlot
      [ovenSpaceDefinition]="context"
    >
      <ng-template ovenSlotPlaceholder></ng-template>
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
