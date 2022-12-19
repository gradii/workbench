import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector       : 'ub-position-group-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : [
    './field.scss',
    './position-group-settings-field.component.scss'
  ],
  template       : `
    <tri-button-group>
      <button
        *ngFor="let option of options"
        triButton
        variant="outlined"
        [title]="option.title||''"
        [ngClass]="{ active: option.value === value }"
        class="clear-icon direction"
        size="small"
        (click)="update(option.value)"
      >
        <tri-icon *ngIf="option.icon; else textTpl" [svgIcon]="option.icon"></tri-icon>
        <ng-template #textTpl>{{ option.label }}</ng-template>
      </button>
    </tri-button-group>
  `
})
export class PositionGroupSettingsFieldComponent {
  @HostBinding('class') elementClass = 'row-field no-top-margin';

  @Input() value: boolean;
  @Input() options: { icon: string; value: string, title?: string, label?: string }[];
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  update(value) {
    this.valueChange.emit(value);
  }
}
