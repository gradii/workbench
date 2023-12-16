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

@Directive({ selector: '[ovenTableCellSlot]' })
export class TableCellSlotDirective extends SlotDirective {
  @Input() slotId: string;
}

@Directive({ selector: '[ovenTable]' })
export class TableDirective {
}

@Directive({ selector: '[ovenTableDefinition]' })
export class TableDefinitionDirective {
  @ContentChildren(TableCellSlotDirective, { descendants: true }) cellsContent: QueryList<SlotDirective>;

  @Input('ovenTableDefinition') set context(context: TableDefinitionContext) {
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
  selector: 'oven-table-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table
      ovenTable
      class="table"
      *ovenDefinition="let context"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithMargins]="context.view?.instance.margins"
      [ovenWithBackground]="context.view?.instance.background"
      [ovenWithActions]="context.view?.instance.actions"
      [class.border]="context.view?.instance.border"
      [ovenTableDefinition]="context"
    >
      <thead>
        <th
          *ngFor="let col of context.view?.instance.columns || []; trackBy: trackById"
          [ovenWithFormFieldWidth]="col.width"
          ovenTableCellSlot
          [slotId]="col.id"
        >
          <ng-template ovenSlotPlaceholder></ng-template>
        </th>
      </thead>
      <tbody>
        <tr *ngFor="let row of context.view?.instance.rows || []; trackBy: trackById">
          <td *ngFor="let cell of row['cells']; trackBy: trackById" ovenTableCellSlot [slotId]="cell.id">
            <ng-template ovenSlotPlaceholder></ng-template>
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
