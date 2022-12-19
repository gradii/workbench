import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pf-space-direction-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./stick-field.component.scss'],
  template: `
    <pf-setting-label-container>
      <span class="editor-filed-label">Direction</span>
    </pf-setting-label-container>
    <ub-position-group-settings-field [options]="options" [value]="value" (valueChange)="positionChange($event)">
    </ub-position-group-settings-field>
  `
})
export class SpaceDirectionFieldComponent {
  @Input() value: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  options = [
    { icon: 'display:direction_column', value: 'column' },
    { icon: 'display:direction_row', value: 'row' }
  ];

  positionChange(value: string) {
    this.valueChange.emit(value);
  }
}
