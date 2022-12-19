import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ub-dropdown-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./field.scss', './dropdown-settings-field.component.scss'],
  template: `
    <pf-setting-label-container [showNotification]="showStyleNotification">
      <label class="settings-field-label">{{ name }}</label>
    </pf-setting-label-container>
    <tri-select
      [value]="selected"
      [disabled]="disabled"
      (valueChange)="selectedChange.emit($event)"
      fullWidth
    >
      <tri-option class="settings-option-item" *ngFor="let option of options" [value]="option.value">
        <tri-icon *ngIf="option.icon" [svgIcon]="option.icon"></tri-icon>{{ option.label }}</tri-option
      >
    </tri-select>
  `
})
export class DropdownSettingsFieldComponent {
  get selectedLabel(): string {
    return this.selectedOption && this.selectedOption.label;
  }

  get selectedIcon(): string {
    return this.selectedOption && this.selectedOption.icon;
  }

  get selectedOption() {
    return this.options.find(({ value }) => value === this.selected);
  }

  @Input() name: string;
  @Input() selected: string;
  @Input() disabled: boolean;
  @Input() options: { label: string; icon?: string; value: string }[];
  @Input() showStyleNotification = true;
  @Output() selectedChange: EventEmitter<string> = new EventEmitter();
}
