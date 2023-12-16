import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  QueryList,
  ViewChild
} from '@angular/core';
import { NbAccordionComponent } from '@nebular/theme';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, Slot, SlotDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type AccordionDefinitionContext = DefinitionContext<NbAccordionComponent>;

@Directive({ selector: '[ovenAccordionItemSlot]' })
export class AccordionItemSlotDirective extends SlotDirective {
  @Input() slotId: string;
}

@Directive({ selector: '[ovenAccordionDefinition]' })
export class AccordionDefinitionDirective {
  @ContentChildren(AccordionItemSlotDirective) accordionItemsContent: QueryList<SlotDirective>;

  @Input('ovenAccordionDefinition') set view(context: AccordionDefinitionContext) {
    context.view = {
      instance: this.items,
      slots: {},
      element: this.element,
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
    public items: NbAccordionComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector: 'oven-item-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-accordion
      fullWidth
      cdkScrollable
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenAccordionDefinition]="context"
    >
      <nb-accordion-item
        *ngFor="let item of context.view?.instance.options; trackBy: trackTab"
        ovenAccordionItemSlot
        [slotId]="item.id"
      >
        <nb-accordion-item-header>
          {{ item.value }}
        </nb-accordion-item-header>
        <nb-accordion-item-body>
          <ng-template ovenSlotPlaceholder></ng-template>
        </nb-accordion-item-body>
      </nb-accordion-item>
    </nb-accordion>
  `
})
export class AccordionDefinitionComponent implements ComponentDefinition<AccordionDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<AccordionDefinitionContext>;

  trackTab(index, item) {
    return item.id;
  }
}
