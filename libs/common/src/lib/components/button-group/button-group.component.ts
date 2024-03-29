import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'bc-button-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./button-group.component.scss'],
  template: `
    <button
      *ngFor="let option of options"
      nbButton
      size="small"
      class="button-group-item"
      [class.active]="isOptionSelected(option)"
      (click)="valueChange.emit(option.value)"
    >
      <bc-icon *ngIf="option.icon" [name]="option.icon"></bc-icon>
      <ng-template ngIf="option.label">{{ option.label }}</ng-template>
    </button>
  `
})
export class ButtonGroupComponent {
  @Input() value: any;
  @Input() values: any[];
  @Input() options: { label?: string; icon?: string; value: any }[];
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  isOptionSelected(option): boolean {
    if (this.values) {
      return this.values.includes(option.value);
    } else {
      return this.value === option.value;
    }
  }
}
