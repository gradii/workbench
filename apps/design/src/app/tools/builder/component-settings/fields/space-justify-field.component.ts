import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

const defaultOptions = [
  { icon: 'alignment-left', value: 'flex-start' },
  { icon: 'alignment-center-horizontal', value: 'center' },
  { icon: 'alignment-right', value: 'flex-end' }
];

@Component({
  selector: 'ub-space-justify-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./stick-field.component.scss'],
  template: `
    <ub-setting-label-container><span class="label">Horizontal</span></ub-setting-label-container>
    <ub-position-group-settings-field [options]="options" [value]="value" (valueChange)="positionChange($event)">
    </ub-position-group-settings-field>
  `
})
export class SpaceJustifyFieldComponent {
  @Input() value: string;

  @Input() set direction(direction: string) {
    if (direction === 'row') {
      this.options = [
        ...defaultOptions,
        { icon: 'space-between-horizontal', value: 'space-between' },
        { icon: 'space-around-horizontal', value: 'space-around' }
      ];
    } else {
      this.options = [...defaultOptions, { icon: 'space-stretch-horizontal', value: 'stretch' }];
    }
  }

  @Input() set hiddenOptions(value: string[]) {
    this.options = this.options.filter(option => !value.includes(option.value));
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  options = defaultOptions;

  constructor(private cd: ChangeDetectorRef) {
  }

  positionChange(value: string) {
    this.valueChange.emit(value);
  }
}
