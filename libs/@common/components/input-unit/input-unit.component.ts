import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PopoverDirective } from '@gradii/triangle/popover';

@Component({
  selector       : 'bc-input-unit-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./unit-list.component.scss'],
  template       : ` <span *ngFor="let unit of unitList" (click)="updateUnit.emit(unit.value)">{{ unit.label }}</span> `
})
export class InputUnitListComponent {
  @Input() unitList: { label: string; value: string }[];
  @Output() updateUnit: EventEmitter<string> = new EventEmitter<string>();
}

@Component({
  selector       : 'bc-input-unit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./input-unit.component.scss'],
  template       : `
    <tri-input-group>
      <ng-content select="tri-input-number"></ng-content>
      <ng-template #suffix>
        <div
          class="unit"
          *ngIf="showUnit"
          [class.disabled]="unitDisabled || unitList.length < 2"
          [triPopover]="unitOptions"
          triPopoverPosition="bottomRight"
        >
          {{ selectedUnit }}
        </div>
      </ng-template>
    </tri-input-group>

    <ng-template #unitOptions>
      <bc-input-unit-list [unitList]="unitList" (updateUnit)="updateUnit($event)"></bc-input-unit-list>
    </ng-template>
  `
})
export class InputUnitComponent {
  @ViewChild(PopoverDirective) popover: PopoverDirective;
  @Input() unitList: { label: string; value: string }[];
  @Input() selectedUnit: string;
  @Input() showUnit     = true;
  @Input() unitDisabled = false;

  @Output() unitChange: EventEmitter<string> = new EventEmitter<string>();

  updateUnit(unit: string) {
    this.popover.hide();
    this.unitChange.emit(unit);
  }
}
