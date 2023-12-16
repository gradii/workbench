import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ub-space-direction-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./stick-field.component.scss'],
  template: `
    <ub-setting-label-container><span class="label">Direction</span></ub-setting-label-container>
    <ub-position-group-settings-field [options]="options" [value]="value" (valueChange)="positionChange($event)">
    </ub-position-group-settings-field>
  `
})
export class SpaceDirectionFieldComponent {
  @Input() value: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  options = [
    { icon: 'direction-column', value: 'column' },
    { icon: 'direction-row', value: 'row' }
  ];

  positionChange(value: string) {
    this.valueChange.emit(value);
  }
}
