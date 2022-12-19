import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector       : 'pf-space-gap-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./stick-field.component.scss'],
  template       : `
    <pf-setting-label-container>
      <span class="editor-filed-label">Gap</span>
    </pf-setting-label-container>
    <pf-gap-settings-field [value]="value" (valueChange)="gapChange($event)">
    </pf-gap-settings-field>
  `,
  styles: [`
    :host {
      padding: 0.4rem;
    }
  `]
})
export class SpaceGapFieldComponent {
  @Input() value: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  gapChange(value: string) {
    this.valueChange.emit(value);
  }
}
