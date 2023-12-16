import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ub-overflow-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./field.scss', './overflow-settings-field.component.scss'],
  template: `
    <div class="select-container">
      <ub-setting-label-container>
        <label class="settings-field-label">Horizontal</label>
      </ub-setting-label-container>
      <nb-select
        [selected]="valueX"
        (selectedChange)="valueXChange.emit($event)"
        #selectRef
        [ubOverlayRegister]="selectRef"
        ubOverlayRegister
        class="bakery-dropdown"
        shape="rectangle"
      >
        <nb-option *ngFor="let option of options" [value]="option.value">{{ option.label }}</nb-option>
      </nb-select>
    </div>
    <div class="select-container">
      <ub-setting-label-container>
        <label class="settings-field-label">Vertical</label>
      </ub-setting-label-container>
      <nb-select
        [selected]="valueY"
        (selectedChange)="valueYChange.emit($event)"
        #secondSelectRef
        [ubOverlayRegister]="secondSelectRef"
        ubOverlayRegister
        class="bakery-dropdown"
        shape="rectangle"
      >
        <nb-option *ngFor="let option of options" [value]="option.value">{{ option.label }}</nb-option>
      </nb-select>
    </div>
  `
})
export class OverflowSettingsFieldComponent {
  @Input() valueX: string;
  @Input() valueY: string;

  @Output() valueXChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() valueYChange: EventEmitter<string> = new EventEmitter<string>();

  options = [
    { label: 'visible', value: 'visible' },
    { label: 'hidden', value: 'hidden' },
    { label: 'scroll', value: 'scroll' },
    { label: 'auto', value: 'auto' },
    { label: 'inherit', value: 'inherit' }
  ];
}
