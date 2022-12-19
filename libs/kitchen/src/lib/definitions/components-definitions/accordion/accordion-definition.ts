import {
  ChangeDetectionStrategy, Component, ContentChildren, Directive, ElementRef, Input, QueryList, ViewChild
} from '@angular/core';
import { AccordionComponent } from '@gradii/triangle/accordion';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, Slot, SlotDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type AccordionDefinitionContext = DefinitionContext<AccordionComponent>;

@Directive({ selector: '[kitchenAccordionItemSlot]' })
export class AccordionItemSlotDirective extends SlotDirective {
  @Input() slotId: string;
}

@Directive({ selector: '[kitchenAccordionDefinition]' })
export class AccordionDefinitionDirective {
  @ContentChildren(AccordionItemSlotDirective) accordionItemsContent: QueryList<SlotDirective>;

  @Input('kitchenAccordionDefinition') set view(context: AccordionDefinitionContext) {
    context.view = {
      instance          : this.items,
      slots             : {},
      element           : this.element,
      updateDynamicSlots: () => {
        context.view.slots = this.accordionItemsContent.reduce(
          (slots: { [key: string]: Slot }, item: AccordionItemSlotDirective) => {
            slots[item.slotId] = item;
            return slots;
          },
          {}
        );
      }
    };
    this.actionsDirective.listen(() => null);
  }

  constructor(
    public items: AccordionComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector       : 'kitchen-item-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-accordion
      fullWidth
      cdkScrollable
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithSizeMargins]="context.view?.instance.margins"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithActions]="context.view?.instance.actions"
      [kitchenAccordionDefinition]="context"
    >
      <tri-accordion-item
        *ngFor="let item of context.view?.instance.options; trackBy: trackTab"
        kitchenAccordionItemSlot
        [slotId]="item.id"
        [title]="item.value"
      >
        <ng-template kitchenSlotPlaceholder></ng-template>
      </tri-accordion-item>
    </tri-accordion>
  `
})
export class AccordionDefinitionComponent implements ComponentDefinition<AccordionDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<AccordionDefinitionContext>;

  trackTab(index, item) {
    return item.id;
  }
}
