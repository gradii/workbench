import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pf-state-manager-settings-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./state-manager-settings-header.component.scss'],
  template: `
    <pf-notification-label
      [tooltipText]="notificationText"
      [notificationPlacement]="'right'"
      [showNotification]="unSaved || createMode"
      [reverse]="true"
      [pulse]="false"
    >
      <h5>Variable Properties</h5>
    </pf-notification-label>

    <!--<div class="action-controls">
      <button *ngIf="!createMode" triButton class="bakery-button workflow-icon" ghost (click)="delete.emit()">
        <tri-icon svgIcon="outline:trash"></tri-icon>
      </button>
      <button *ngIf="!createMode" triButton class="bakery-button workflow-icon" ghost (click)="duplicate.emit()">
        <tri-icon svgIcon="outline:copy"></tri-icon>
      </button>
      <button triButton class="save-button" status="success" size="small" (click)="save.emit()">
        <tri-icon svgIcon="outline:save"></tri-icon>
        Save
      </button>
    </div>-->
  `
})
export class StateManagerSettingsHeaderComponent {
  @Input() createMode: boolean;
  @Input() unSaved: boolean;

  // @Output() save: EventEmitter<void> = new EventEmitter<void>();
  // @Output() delete: EventEmitter<void> = new EventEmitter<void>();
  // @Output() duplicate: EventEmitter<void> = new EventEmitter<void>();

  get notificationText() {
    return this.createMode ? `Variable isn't saved` : 'Variable has unsaved changes';
  }
}
