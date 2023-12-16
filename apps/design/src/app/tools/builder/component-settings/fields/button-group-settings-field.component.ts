import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ub-button-group-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./field.scss'],
  template: `
    <ub-setting-label-container [showNotification]="showStyleNotification">
      <span class="settings-field-label">{{ name }}</span>
    </ub-setting-label-container>
    <bc-button-group
      [value]="value"
      [values]="values"
      [options]="options"
      (valueChange)="valueChange.emit($event)"
    ></bc-button-group>
  `
})
export class ButtonGroupSettingsFieldComponent {
  @Input() name: string;
  @Input() value: any;
  @Input() values: any[];
  @Input() options: { label?: string; icon?: string; value: any }[];
  @Input() showStyleNotification = true;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
}
