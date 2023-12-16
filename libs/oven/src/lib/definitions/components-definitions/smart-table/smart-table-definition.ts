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

@Directive({ selector: '[ovenSmartTableDefinition]' })
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

  @Input('ovenSmartTableDefinition') set context(context: SmartTableDefinitionContext) {
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
  selector: 'oven-smart-table-definition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng2-smart-table
      *ovenDefinition="let context"
      [ovenWithActions]="context.view?.instance.actions"
      [ovenWithVisible]="context.view?.instance.visible"
      [ovenWithSize]="context.view?.instance.size"
      [ovenWithMargins]="context.view?.instance.margins"
      [settings]="context.view?.instance.settings || {}"
      [source]="context.view?.instance.source"
      [ovenSmartTableDefinition]="context"
    >
    </ng2-smart-table>
  `
})
export class SmartTableDefinitionComponent implements ComponentDefinition<SmartTableDefinitionContext> {
  @ViewChild(DefinitionDirective) definition: DefinitionDirective<SmartTableDefinitionContext>;
}
