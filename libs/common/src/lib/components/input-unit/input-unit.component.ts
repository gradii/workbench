import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';

@Component({
  selector: 'bc-input-unit-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./unit-list.component.scss'],
  template: ` <span *ngFor="let unit of unitList" (click)="updateUnit.emit(unit.value)">{{ unit.label }}</span> `
})
export class InputUnitListComponent {
  @Input() unitList: { label: string; value: string }[];
  @Output() updateUnit: EventEmitter<string> = new EventEmitter<string>();
}

@Component({
  selector: 'bc-input-unit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./input-unit.component.scss'],
  template: `
    <ng-content select="input"></ng-content>
    <div
      class="unit"
      *ngIf="showUnit"
      [class.disabled]="unitDisabled || unitList.length < 2"
      [nbPopover]="unitOptions"
      nbPopoverPlacement="bottom-right"
      nbPopoverAdjustment="vertical"
    >
      {{ selectedUnit }}
    </div>

    <ng-template #unitOptions>
      <bc-input-unit-list [unitList]="unitList" (updateUnit)="updateUnit($event)"></bc-input-unit-list>
    </ng-template>
  `
})
export class InputUnitComponent {
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  @Input() unitList: { label: string; value: string }[];
  @Input() selectedUnit: string;
  @Input() showUnit = true;
  @Input() unitDisabled = false;

  @Output() unitChange: EventEmitter<string> = new EventEmitter<string>();

  updateUnit(unit: string) {
    this.popover.hide();
    this.unitChange.emit(unit);
  }
}
