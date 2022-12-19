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

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective, Slot, SlotDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';

type TableDefinitionContext = DefinitionContext<TableDirective>;

@Directive({ selector: '[kitchenTableCellSlot]' })
export class TableCellSlotDirective extends SlotDirective {
  @Input() slotId: string;
}

@Directive({ selector: '[kitchenTable]' })
export class TableDirective {
}

@Directive({ selector: '[kitchenTableDefinition]' })
export class TableDefinitionDirective {
  @ContentChildren(TableCellSlotDirective, { descendants: true }) cellsContent: QueryList<SlotDirective>;

  @Input('kitchenTableDefinition') set context(context: TableDefinitionContext) {
    context.view = {
      instance: this.table,
      slots: {},
      element: this.element,
      updateDynamicSlots: () => {
        context.view.slots = this.cellsContent.reduce(
          (slots: { [key: string]: Slot }, item: TableCellSlotDirective) => {
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
    public table: TableDirective,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective
  ) {
  }
}

@Component({
  selector: 'kitchen-table-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table
      kitchenTable
      class="table"
      *kitchenDefinition="let context"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithMargins]="context.view?.instance.margins"
      [kitchenWithBackground]="context.view?.instance.background"
      [kitchenWithActions]="context.view?.instance.actions"
      [class.border]="context.view?.instance.border"
      [kitchenTableDefinition]="context"
    >
      <thead>
        <th
          *ngFor="let col of context.view?.instance.columns || []; trackBy: trackById"
          [kitchenWithFormFieldWidth]="col.width"
          kitchenTableCellSlot
          [slotId]="col.id"
        >
          <ng-template kitchenSlotPlaceholder></ng-template>
        </th>
      </thead>
      <tbody>
        <tr *ngFor="let row of context.view?.instance.rows || []; trackBy: trackById">
          <td *ngFor="let cell of row['cells']; trackBy: trackById" kitchenTableCellSlot [slotId]="cell.id">
            <ng-template kitchenSlotPlaceholder></ng-template>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class TableDefinitionComponent implements ComponentDefinition<TableDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<TableDefinitionContext>;

  trackById(index, domain) {
    return domain.id;
  }
}
