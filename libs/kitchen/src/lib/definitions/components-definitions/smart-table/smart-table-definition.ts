import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DefinitionContext } from '../../definition';
import { ComponentDefinition, DefinitionDirective } from '../../definition-utils';
import { WithActionsDirective } from '../../definition-utils/with-actions.directive';
import { listenSmartTableTriggers } from './smart-table-triggers';
import { UIDataService } from '../../definition-utils/ui-data.service';

type SmartTableDefinitionContext = DefinitionContext<Ng2SmartTableComponent>;

@Directive({ selector: '[kitchenSmartTableDefinition]' })
export class SmartTableDefinitionDirective {
  private destroyed = new Subject<void>();

  constructor(
    private ngZone: NgZone,
    public table: Ng2SmartTableComponent,
    public element: ElementRef,
    private actionsDirective: WithActionsDirective,
    private uiDataService: UIDataService
  ) {
  }

  @Input('kitchenSmartTableDefinition') set context(context: SmartTableDefinitionContext) {
    context.view = {
      instance: this.table,
      slots: null,
      element: this.element
    };

    this.table.userRowSelect.pipe(takeUntil(this.destroyed)).subscribe(data => {
      this.uiDataService.updateUIVariable((context.view.instance as any).name, 'selectedRow', data.data);
    });

    this.table.createConfirm.pipe(takeUntil(this.destroyed)).subscribe(data => {
      this.uiDataService.updateUIVariable((context.view.instance as any).name, 'newRow', data.newData);
    });

    this.table.deleteConfirm.pipe(takeUntil(this.destroyed)).subscribe(data => {
      this.uiDataService.updateUIVariable((context.view.instance as any).name, 'deletedRow', data.data);
    });

    this.table.editConfirm.pipe(takeUntil(this.destroyed)).subscribe(data => {
      this.uiDataService.updateUIVariable((context.view.instance as any).name, 'editedRow', data.newData);
    });

    this.actionsDirective.listen((trigger: string, callback: (value: any) => void) => {
      return listenSmartTableTriggers(this.table, trigger, callback);
    });
  }
}

@Component({
  selector: 'kitchen-smart-table-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng2-smart-table
      *kitchenDefinition="let context"
      [kitchenWithActions]="context.view?.instance.actions"
      [kitchenWithVisible]="context.view?.instance.visible"
      [kitchenWithSize]="context.view?.instance.size"
      [kitchenWithMargins]="context.view?.instance.margins"
      [settings]="context.view?.instance.settings || {}"
      [source]="context.view?.instance.source"
      [kitchenSmartTableDefinition]="context"
    >
    </ng2-smart-table>
  `
})
export class SmartTableDefinitionComponent implements ComponentDefinition<SmartTableDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<SmartTableDefinitionContext>;
}
