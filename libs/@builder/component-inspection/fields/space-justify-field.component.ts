import { ChangeDetectionStrategy, ɵmarkDirty, Component, EventEmitter, Input, Output } from '@angular/core';

const defaultRowOptions = [
  { icon: 'display:justify_flex-start_row', value: 'flex-start', title: 'justify-content: flex-start' },
  { icon: 'display:justify_center_row', value: 'center', title: 'justify-content: center' },
  { icon: 'display:justify_flex-end_row', value: 'flex-end', title: 'justify-content: flex-end' }
];

const defaultColumnOptions = [
  { icon: 'display:align_flex-start_column', value: 'flex-start', title: 'align-items: flex-start' },
  { icon: 'display:align_center_column', value: 'center', title: 'align-items: center' },
  { icon: 'display:align_flex-end_column', value: 'flex-end', title: 'align-items: flex-end' }
];

@Component({
  selector       : 'pf-space-horizontal-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./stick-field.component.scss'],
  template       : `
    <pf-setting-label-container>
      <span class="editor-field-label">Horizontal</span>
    </pf-setting-label-container>
    <ub-position-group-settings-field
      [options]="options"
      [value]="value"
      (valueChange)="positionChange($event)">
    </ub-position-group-settings-field>
  `
})
export class SpaceJustifyFieldComponent {
  @Input() value: string;

  @Input() set direction(direction: string) {
    if (direction === 'row') {
      this.options = [
        ...defaultRowOptions,
        { icon: 'display:justify_space-between_row', value: 'space-between',  title: 'justify-content: space-between' },
        { icon: 'display:justify_space-around_row', value: 'space-around',  title: 'justify-content: space-around' }
      ];
    } else {
      this.options = [
        ...defaultColumnOptions,
        { icon: 'display:align_stretch_column', value: 'stretch', title: 'align-items: stretch' },
        { icon: 'display:align_baseline_column', value: 'baseline', title: 'align-items: baseline' }
      ];
    }
  }

  @Input()
  set hiddenOptions(value: string[]) {
    this.options = this.options.filter(option => !value.includes(option.value));
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  options = defaultRowOptions;

  constructor() {
  }

  positionChange(value: string) {
    this.valueChange.emit(value);
  }
}
