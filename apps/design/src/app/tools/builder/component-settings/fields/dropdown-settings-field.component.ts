import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ub-dropdown-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./field.scss', './dropdown-settings-field.component.scss'],
  template: `
    <ub-setting-label-container [showNotification]="showStyleNotification">
      <label class="settings-field-label">{{ name }}</label>
    </ub-setting-label-container>
    <nb-select
      [selected]="selected"
      [disabled]="disabled"
      (selectedChange)="selectedChange.emit($event)"
      #selectRef
      [ubOverlayRegister]="selectRef"
      ubOverlayRegister
      fullWidth
      class="bakery-dropdown"
      shape="rectangle"
    >
      <nb-select-label>
        <bc-icon *ngIf="selectedIcon" [name]="selectedIcon"></bc-icon> {{ selectedLabel }}
      </nb-select-label>

      <nb-option class="settings-option-item" *ngFor="let option of options" [value]="option.value">
        <bc-icon *ngIf="option.icon" [name]="option.icon"></bc-icon>{{ option.label }}</nb-option
      >
    </nb-select>
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
