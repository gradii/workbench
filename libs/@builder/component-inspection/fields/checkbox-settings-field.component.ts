import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { StateManagerDialogService } from '../../../@workflow-common/state-manager/dialog/state-manager-dialog.service';

@Component({
  selector       : 'pf-checkbox-editor-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./field.scss'],
  template       : `
    <form>
      <pf-setting-label-container [showNotification]="showStyleNotification">
        <div style="display: flex;justify-content: space-between;align-items: center;flex: 1;">
          <tri-checkbox [checked]="value" (checkedChange)="update($event)">
            <span class="settings-field-label">{{ name }}</span>
          </tri-checkbox>
          <div style="
           font-size:20px;
           width:20px;
           height:20px;
           display:flex;
           justify-content:center;
           align-items:center;
           background: rgba(191,191,191,0.8);
           cursor: pointer;
           border-radius: 4px;"
               (click)="onClick()"
          >
            <tri-icon svgIcon="reiki:brace-variable"></tri-icon>
          </div>
        </div>
      </pf-setting-label-container>
    </form>
  `
})
export class CheckboxSettingsFieldComponent {
  @Input() name: string;
  @Input() value: boolean;
  @Input() showStyleNotification               = true;
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private stateManagerDialogService: StateManagerDialogService) {
  }

  update(value) {
    this.valueChange.emit(value);
  }

  onClick() {
    this.stateManagerDialogService.open();
  }
}
