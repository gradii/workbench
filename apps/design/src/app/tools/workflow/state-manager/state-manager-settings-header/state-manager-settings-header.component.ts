import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ub-state-manager-settings-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./state-manager-settings-header.component.scss'],
  template: `
    <bc-notification-label
      [tooltipText]="notificationText"
      [notificationPlacement]="'end'"
      [showNotification]="unSaved || createMode"
      [reverse]="true"
      [pulse]="false"
    >
      <h3 class="workflow-title">VARIABLE PROPERTIES</h3>
    </bc-notification-label>

    <div class="action-controls">
      <button *ngIf="!createMode" nbButton class="bakery-button workflow-icon" ghost (click)="delete.emit()">
        <bc-icon name="trash-2"></bc-icon>
      </button>
      <button *ngIf="!createMode" nbButton class="bakery-button workflow-icon" ghost (click)="duplicate.emit()">
        <bc-icon name="copy-outline"></bc-icon>
      </button>
      <button nbButton class="save-button" status="success" size="small" (click)="save.emit()">
        <bc-icon name="save"></bc-icon>
        Save
      </button>
    </div>
  `
})
export class StateManagerSettingsHeaderComponent {
  @Input() createMode: boolean;
  @Input() unSaved: boolean;

  @Output() save: EventEmitter<void> = new EventEmitter<void>();
  @Output() delete: EventEmitter<void> = new EventEmitter<void>();
  @Output() duplicate: EventEmitter<void> = new EventEmitter<void>();

  get notificationText() {
    return this.createMode ? `Variable isn't saved` : 'Variable has unsaved changes';
  }
}
