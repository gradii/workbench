import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ub-checkbox-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./field.scss'],
  template: `
    <form>
      <ub-setting-label-container [showNotification]="showStyleNotification">
        <nb-checkbox [checked]="value" (checkedChange)="update($event)">
          <span class="settings-field-label">{{ name }}</span>
        </nb-checkbox>
      </ub-setting-label-container>
    </form>
  `
})
export class CheckboxSettingsFieldComponent {
  @Input() name: string;
  @Input() value: boolean;
  @Input() showStyleNotification = true;
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  update(value) {
    this.valueChange.emit(value);
  }
}
