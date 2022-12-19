import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ub-overflow-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./field.scss', './overflow-settings-field.component.scss'],
  template: `
    <div class="select-container">
      <pf-setting-label-container>
        <label class="settings-field-label">Horizontal</label>
      </pf-setting-label-container>
      <tri-select
        [value]="valueX"
        (change)="valueXChange.emit($event)"
        class="bakery-dropdown"
        shape="rectangle"
      >
        <tri-option *ngFor="let option of options" [value]="option.value">{{ option.label }}</tri-option>
      </tri-select>
    </div>
    <div class="select-container">
      <pf-setting-label-container>
        <label class="settings-field-label">Vertical</label>
      </pf-setting-label-container>
      <tri-select
        [value]="valueY"
        (change)="valueYChange.emit($event)"
        class="bakery-dropdown"
        shape="rectangle"
      >
        <tri-option *ngFor="let option of options" [value]="option.value">{{ option.label }}</tri-option>
      </tri-select>
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
