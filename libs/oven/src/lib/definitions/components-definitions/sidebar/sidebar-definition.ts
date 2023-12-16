import { Directionality } from '@angular/cdk/bidi';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  ViewChild
} from '@angular/core';
import { NbLayoutComponent, NbSidebarComponent } from '@nebular/theme';
import { of } from 'rxjs';

import { SpacingService } from '@common';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, SlotDirective } from '../../definition-utils';
import { layoutBackgrounds } from '../../definition-utils/with-theme-variable.directive';

type SidebarDefinitionContext = DefinitionContext<NbSidebarComponent>;

@Directive({ selector: '[ovenSidebarSlot]' })
export class SidebarSlotDirective extends SlotDirective {
}

@Directive({ selector: '[ovenSidebarDefinition]' })
export class SidebarDefinitionDirective implements OnDestroy {
  private cdkScrollable: CdkScrollable;

  @Input('ovenSidebarDefinition') set context(context: SidebarDefinitionContext) {
    this.fixScrollable();
    context.view = {
      instance: this.sidebar,
      slots: { content: this.contentSlot },
      element: this.element,
      draggable$: of(false)
    };
  }

  constructor(
    private scrollDispatcher: ScrollDispatcher,
    private ngZone: NgZone,
    public sidebar: NbSidebarComponent,
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
  selector: 'oven-sidebar-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NbLayoutComponent, useValue: {} }],
  template: `
    <nb-sidebar
      *ovenDefinition="let context"
      ovenRegisterSidebar
      [ovenSidebarResponsive]="context.view?.instance.responsiveValue"
      [ovenWithThemeVariable]="this.computeThemeVariables(context.view?.instance)"
      ovenSidebarSlot
      [ovenSidebarDefinition]="context"
    >
      <ng-template ovenSlotPlaceholder></ng-template>
    </nb-sidebar>
  `
})
export class SidebarDefinitionComponent implements ComponentDefinition<SidebarDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<SidebarDefinitionContext>;

  constructor(private spacingService: SpacingService) {
  }

  computeThemeVariables(instance) {
    return (
      instance && {
        '--sidebar-width': instance.size.widthValue + instance.size.widthUnit,
        '--sidebar-padding': this.spacingService.getPaddingCssValue(instance.paddings),
        '--sidebar-background-color': layoutBackgrounds[instance.background.color]
      }
    );
  }
}
