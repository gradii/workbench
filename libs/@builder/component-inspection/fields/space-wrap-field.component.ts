import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector       : 'pf-space-wrap-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./stick-field.component.scss'],
  template       : `
    <pf-setting-label-container>
      <span class="editor-filed-label">Wrap</span>
    </pf-setting-label-container>
    <ub-position-group-settings-field [options]="options" [value]="value" (valueChange)="wrapChange($event)">
    </ub-position-group-settings-field>
  `
})
export class SpaceWrapFieldComponent {
  @Input() value: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  options = [
    { value: 'nowrap', label: 'no wrap' },
    { value: 'wrap', label: 'wrap' },
    // { value: 'wrap-reverse', label: 'Wrap Reverse' }
  ];

  wrapChange(value: string) {
    this.valueChange.emit(value);
  }
}
