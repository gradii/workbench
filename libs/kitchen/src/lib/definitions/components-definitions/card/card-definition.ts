import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import { CardComponent } from '@gradii/triangle/card';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, SlotDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type CardDefinitionContext = DefinitionContext<CardComponent>;

@Directive({ selector: '[kitchenCardHeaderSlot]' })
export class CardHeaderSlotDirective extends SlotDirective {
}

@Directive({ selector: '[kitchenCardBodySlot]' })
export class CardBodySlotDirective extends SlotDirective {
}

@Directive({ selector: '[kitchenCardFooterSlot]' })
export class CardFooterSlotDirective extends SlotDirective {
}

@Directive({ selector: '[kitchenCardDefinition]' })
export class CardDefinitionDirective {
  @ContentChild(CardHeaderSlotDirective) headerSlot: SlotDirective;
  @ContentChild(CardBodySlotDirective) bodySlot: SlotDirective;
  @ContentChild(CardFooterSlotDirective) footerSlot: SlotDirective;

  @Input('kitchenCardDefinition')
  set view(context: CardDefinitionContext) {
    context.view = {
      instance: this.card,
      slots: {},
      element: this.element,
      updateDynamicSlots: () => {
        const slots = { body: this.bodySlot };
        if (this.headerSlot) {
          slots['header'] = this.headerSlot;
        }
        if (this.footerSlot) {
          slots['footer'] = this.footerSlot;
        }
        context.view.slots = slots;
      }
    };
    this.actionsDirective.listen(() => null);
  }

  constructor(
    public card: CardComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector: 'kitchen-card-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tri-card
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithSizeMargins]="context.view?.instance.margins"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithBackground]="context.view?.instance.background"
      [kitchenWithActions]="context.view?.instance.actions"
      [kitchenCardDefinition]="context"
      style="transition-property:none"
    >
      <tri-card-header
        *ngIf="context.view?.instance.showHeader"
        #headerSlot
        [class.no-padding]="!context.view?.instance.headerPadding"
        kitchenCardHeaderSlot
      >
        <ng-template kitchenSlotPlaceholder></ng-template>
      </tri-card-header>
      <tri-card-body kitchenCardBodySlot [class.no-padding]="!context.view?.instance.bodyPadding" cdkScrollable>
        <ng-template kitchenSlotPlaceholder></ng-template>
      </tri-card-body>
      <tri-card-footer
        *ngIf="context.view?.instance.showFooter"
        #footerSlot
        [class.no-padding]="!context.view?.instance.footerPadding"
        kitchenCardFooterSlot
      >
        <ng-template kitchenSlotPlaceholder></ng-template>
      </tri-card-footer>
    </tri-card>
  `
})
export class CardDefinitionComponent implements ComponentDefinition<CardDefinitionContext> {
  @ViewChild(DefinitionDirective)
  definition: DefinitionDirective<CardDefinitionContext>;
}
