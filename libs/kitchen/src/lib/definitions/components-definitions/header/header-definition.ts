import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';

import { SpacingService } from '@common/public-api';
import { Header } from '@gradii/triangle/layout';
import { of } from 'rxjs';
import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, SlotDirective } from '../../definition-utils';
import { layoutBackgrounds } from '../../definition-utils/with-theme-variable.directive';

type HeaderDefinitionContext = DefinitionContext<Header>;

@Directive({ selector: '[kitchenHeaderSlot]' })
export class HeaderSlotDirective extends SlotDirective {
}

@Directive({ selector: '[kitchenHeaderDefinition]' })
export class HeaderDefinitionDirective {
  @Input('kitchenHeaderDefinition') set context(context: HeaderDefinitionContext) {
    context.view = {
      instance: this.header,
      slots: { content: this.contentSlot },
      element: this.element,
      draggable$: of(false)
    };
  }

  constructor(
    public header: Header,
    public element: ElementRef,
    public contentSlot: HeaderSlotDirective
  ) {
  }
}

@Component({
  selector: 'kitchen-header-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tri-header
      *kitchenDefinition="let context"
      [kitchenWithThemeVariable]="this.computeThemeVariables(context.view?.instance)"
      kitchenHeaderSlot
      [kitchenHeaderDefinition]="context"
    >
      <ng-template kitchenSlotPlaceholder></ng-template>
    </tri-header>
  `
})
export class HeaderDefinitionComponent implements ComponentDefinition<HeaderDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<HeaderDefinitionContext>;

  constructor(private spacingService: SpacingService) {
  }

  computeThemeVariables(instance) {
    return (
      instance && {
        '--header-height': instance.size.heightValue + 'px',
        '--header-padding': this.spacingService.getPaddingCssValue(instance.paddings),
        '--header-background-color': layoutBackgrounds[instance.background.color]
      }
    );
  }
}
