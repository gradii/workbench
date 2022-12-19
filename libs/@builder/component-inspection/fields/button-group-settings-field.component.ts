import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ɵmarkDirty } from '@angular/core';

@Component({
  selector       : 'ub-button-group-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./field.scss'],
  template       : `
    <pf-setting-label-container [showNotification]="showStyleNotification">
      <span class="settings-field-label">{{ name }}</span>
    </pf-setting-label-container>
    <tri-radio-group *ngIf="!values" [ngModel]="value" (ngModelChange)="valueChange.emit($event)">
      <label tri-radio-button *ngFor="let it of options" [value]="it.value">
        <tri-icon *ngIf="it.icon" [svgIcon]="it.icon"></tri-icon>
        <span *ngIf="it.label">{{ it.label }}</span>
      </label>
    </tri-radio-group>

    <tri-button-toggle-group *ngIf="values" multiple [value]="values">
      <tri-button-toggle *ngFor="let it of options" [value]="it.value" (change)="valueChange.emit(it.value)">
        <tri-icon *ngIf="it.icon" [svgIcon]="it.icon"></tri-icon>
        {{it.label}}
      </tri-button-toggle>
    </tri-button-toggle-group>
  `
})
export class ButtonGroupSettingsFieldComponent {
  @Input() name: string;
  @Input() value: any;
  @Input() values: any[];
  @Input() options: { label?: string; icon?: string; value: any }[];
  @Input() showStyleNotification = true;

  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  ngAfterViewInit() {
    ɵmarkDirty(this);
  }
}
