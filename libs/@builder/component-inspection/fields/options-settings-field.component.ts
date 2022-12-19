import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'ub-options-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./options-settings-field.component.scss'],
  template: `
    <div class="option" *ngFor="let option of options; let i = index; trackBy: trackByFn">
      <span class="option-label">{{ optionName }} {{ i + 1 }}</span>
      <button *ngIf="canBeDeleted" triButton class="clear-icon" size="xsmall" (click)="remove(i)">
        <tri-icon svgIcon="outline:trash"></tri-icon>
      </button>

      <input
        *ngIf="!customControls"
        triInput
        fullWidth
        [ngModel]="option[valueName]"
        (ngModelChange)="update(i, $event)"
      />

      <!-- Create custom templates -->
      <ng-container *ngFor="let control of customControls">
        <ng-container *ngTemplateOutlet="control['tmpRef']; context: { index: i, width: option[control['field']] }">
        </ng-container>
      </ng-container>
    </div>
    <div class="add-container">
      <button triButton color="primary" class="clear-icon" size="small" (click)="create()">
<!--        <span class="add-label">{{ addLabel }}</span>-->
        <tri-icon [svgIcon]="'outline:plus'"></tri-icon>
      </button>
    </div>
  `
})
export class OptionsSettingsFieldComponent {
  @Input() options: any[];
  @Input() optionName = 'Option';
  @Input() addLabel = 'Add item';
  @Input() valueName = 'value';
  @Input() newOptionDefaultValue = 'New option';
  @Input() minOptions = 1;
  // Can receive custom controls with template reference and field name to output
  @Input() customControls: { tmpRef: TemplateRef<any>; field: string };

  @Output() createOption: EventEmitter<{ value: string }> = new EventEmitter<{ value: string }>();
  @Output() updateOption: EventEmitter<{ index: number; value: string }> = new EventEmitter<{
    index: number;
    value: string;
  }>();
  @Output() removeOption: EventEmitter<number> = new EventEmitter<number>();

  get canBeDeleted() {
    return this.options.length > this.minOptions;
  }

  create() {
    this.createOption.emit({ value: this.newOptionDefaultValue });
  }

  remove(index: number) {
    this.removeOption.emit(index);
  }

  update(index: number, value: string) {
    this.updateOption.emit({ index, value });
  }

  trackByFn(index) {
    return index;
  }
}
