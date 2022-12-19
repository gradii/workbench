import { Directionality } from '@angular/cdk/bidi';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy, Component, Directive, ElementRef, Input, NgZone, OnDestroy, Optional, ViewChild
} from '@angular/core';
import { SidenavComponent } from '@gradii/triangle/sidenav';
import { of } from 'rxjs';

import { SpacingService } from '@common/public-api';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, SlotDirective } from '../../definition-utils';
import { layoutBackgrounds } from '../../definition-utils/with-theme-variable.directive';

type SidebarDefinitionContext = DefinitionContext<SidenavComponent>;

@Directive({ selector: '[kitchenSidebarSlot]' })
export class SidebarSlotDirective extends SlotDirective {
}

@Directive({ selector: '[kitchenSidebarDefinition]' })
export class SidebarDefinitionDirective implements OnDestroy {
  private cdkScrollable: CdkScrollable;

  @Input('kitchenSidebarDefinition') set context(context: SidebarDefinitionContext) {
    this.fixScrollable();
    context.view = {
      instance  : this.sidebar,
      slots     : { content: this.contentSlot },
      element   : this.element,
      draggable$: of(false)
    };
  }

  constructor(
    private scrollDispatcher: ScrollDispatcher,
    private ngZone: NgZone,
    public sidebar: SidenavComponent,
    public element: ElementRef,
    public contentSlot: SidebarSlotDirective,
    @Optional() private dir?: Directionality
  ) {
  }

  ngOnDestroy() {
    this.cdkScrollable.ngOnDestroy();
  }

  // moves cdkScrollable from nb-sidebar to nb-sidebar > .main-container > .scrollable
  // TODO check with every nebular, angular update
  private fixScrollable() {
    const scrollableEl = { nativeElement: this.element.nativeElement.querySelector('.main-container > .scrollable') };
    this.cdkScrollable = new CdkScrollable(scrollableEl, this.scrollDispatcher, this.ngZone, this.dir);
    this.cdkScrollable.ngOnInit();
  }
}

@Component({
  selector       : 'kitchen-sidebar-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-sidenav
      *kitchenDefinition="let context"
      kitchenRegisterSidebar
      [kitchenSidebarResponsive]="context.view?.instance.responsiveValue"
      [kitchenWithThemeVariable]="this.computeThemeVariables(context.view?.instance)"
      kitchenSidebarSlot
      [kitchenSidebarDefinition]="context"
    >
      <ng-template kitchenSlotPlaceholder></ng-template>
    </tri-sidenav>
  `
})
export class SidebarDefinitionComponent implements ComponentDefinition<SidebarDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<SidebarDefinitionContext>;

  constructor(private spacingService: SpacingService) {
  }

  computeThemeVariables(instance) {
    return (
      instance && {
        '--sidebar-width'           : instance.size.widthValue + instance.size.widthUnit,
        '--sidebar-padding'         : this.spacingService.getPaddingCssValue(instance.paddings),
        '--sidebar-background-color': layoutBackgrounds[instance.background.color]
      }
    );
  }
}
