import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, ViewChild } from '@angular/core';
import { NbLayoutComponent, NbLayoutHeaderComponent } from '@nebular/theme';
import { of } from 'rxjs';

import { SpacingService } from '@common';
import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, SlotDirective } from '../../definition-utils';
import { layoutBackgrounds } from '../../definition-utils/with-theme-variable.directive';

type HeaderDefinitionContext = DefinitionContext<NbLayoutHeaderComponent>;

@Directive({ selector: '[ovenHeaderSlot]' })
export class HeaderSlotDirective extends SlotDirective {
}

@Directive({ selector: '[ovenHeaderDefinition]' })
export class HeaderDefinitionDirective {
  @Input('ovenHeaderDefinition') set context(context: HeaderDefinitionContext) {
    context.view = {
      instance: this.header,
      slots: { content: this.contentSlot },
      element: this.element,
      draggable$: of(false)
    };
  }

  constructor(
    public header: NbLayoutHeaderComponent,
    public element: ElementRef,
    public contentSlot: HeaderSlotDirective
  ) {
  }
}

@Component({
  selector: 'oven-header-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NbLayoutComponent, useValue: {} }],
  template: `
    <nb-layout-header
      nbButton
      *ovenDefinition="let context"
      [ovenWithThemeVariable]="this.computeThemeVariables(context.view?.instance)"
      ovenHeaderSlot
      [ovenHeaderDefinition]="context"
    >
      <ng-template ovenSlotPlaceholder></ng-template>
    </nb-layout-header>
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
