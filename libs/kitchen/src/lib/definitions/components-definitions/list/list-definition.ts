import {
  ChangeDetectionStrategy, Component, ContentChildren, Directive, ElementRef, Input, QueryList, ViewChild
} from '@angular/core';
import { ListComponent } from '@gradii/triangle/list';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, Slot, SlotDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type ListDefinitionContext = DefinitionContext<ListComponent>;

@Directive({ selector: '[kitchenListItemSlot]' })
export class ListItemSlotDirective extends SlotDirective {
  @Input() slotId: string;
}

@Directive({ selector: '[kitchenListDefinition]' })
export class ListDefinitionDirective {
  @ContentChildren(ListItemSlotDirective) listItemsContent: QueryList<SlotDirective>;

  @Input('kitchenListDefinition') set view(context: ListDefinitionContext) {
    context.view = {
      instance          : this.list,
      slots             : {},
      element           : this.element,
      updateDynamicSlots: () => {
        context.view.slots = this.listItemsContent.reduce(
          (slots: { [key: string]: Slot }, item: ListItemSlotDirective) => {
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
    public list: ListComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector       : 'kitchen-list-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-list
      cdkScrollable
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithSizeMargins]="context.view?.instance.margins"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithActions]="context.view?.instance.actions"
      [kitchenListDefinition]="context"
    >
      <tri-list-item
        *ngFor="let item of context.view?.instance.rows; trackBy: trackTab"
        kitchenListItemSlot
        [slotId]="item.id"
      >
        <ng-template kitchenSlotPlaceholder></ng-template>
      </tri-list-item>
    </tri-list>
  `
})
export class ListDefinitionComponent implements ComponentDefinition<ListDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<ListDefinitionContext>;

  trackTab(index, item) {
    return item.id;
  }
}
