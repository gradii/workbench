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
import { NbListComponent } from '@nebular/theme';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, Slot, SlotDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type ListDefinitionContext = DefinitionContext<NbListComponent>;

@Directive({ selector: '[ovenListItemSlot]' })
export class ListItemSlotDirective extends SlotDirective {
  @Input() slotId: string;
}

@Directive({ selector: '[ovenListDefinition]' })
export class ListDefinitionDirective {
  @ContentChildren(ListItemSlotDirective) listItemsContent: QueryList<SlotDirective>;

  @Input('ovenListDefinition') set view(context: ListDefinitionContext) {
    context.view = {
      instance: this.list,
      slots: {},
      element: this.element,
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
    public list: NbListComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector: 'oven-list-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-list
      cdkScrollable
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithSizeMargins]="context.view?.instance.margins"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenListDefinition]="context"
    >
      <nb-list-item
        *ngFor="let item of context.view?.instance.rows; trackBy: trackTab"
        ovenListItemSlot
        [slotId]="item.id"
      >
        <ng-template ovenSlotPlaceholder></ng-template>
      </nb-list-item>
    </nb-list>
  `
})
export class ListDefinitionComponent implements ComponentDefinition<ListDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<ListDefinitionContext>;

  trackTab(index, item) {
    return item.id;
  }
}
