import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

const defaultOptions = [
  { icon: 'alignment-top', value: 'flex-start' },
  { icon: 'alignment-center-vertical', value: 'center' },
  { icon: 'alignment-bottom', value: 'flex-end' }
];

@Component({
  selector: 'ub-space-align-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./stick-field.component.scss'],
  template: `
    <ub-setting-label-container><span class="label">Vertical</span></ub-setting-label-container>
    <ub-position-group-settings-field [options]="options" [value]="value" (valueChange)="positionChange($event)">
    </ub-position-group-settings-field>
  `
})
export class SpaceAlignFieldComponent {
  @Input() value: string;

  @Input() set direction(direction: string) {
    if (direction === 'column') {
      this.options = [
        ...defaultOptions,
        { icon: 'space-between-vertical', value: 'space-between' },
        { icon: 'space-around-vertical', value: 'space-around' }
      ];
    } else {
      this.options = [...defaultOptions, { icon: 'space-stretch-vertical', value: 'stretch' }];
    }
  }

  @Input() set hiddenOptions(value: string[]) {
    this.options = this.options.filter(option => !value.includes(option.value));
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  options = defaultOptions;

  positionChange(value: string) {
    this.valueChange.emit(value);
  }
}
