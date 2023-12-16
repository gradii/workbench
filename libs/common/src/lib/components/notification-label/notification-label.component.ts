import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { NbTrigger } from '@nebular/theme';

@Component({
  selector: 'bc-notification-label',
  styleUrls: ['./notification-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="point-container"
      *ngIf="showNotification"
      [nbTooltip]="tooltipText"
      [nbTooltipIcon]="{ icon: 'info', status: 'info' }"
      [nbTooltipPlacement]="notificationPlacement"
      nbTooltipAdjustment="noop"
      [nbTooltipTrigger]="getPopoverTrigger()"
      (mouseenter)="viewed.emit()"
    >
      <div [class.pulse]="pulse" class="point" [class.disabled]="notificationDisabled"></div>
    </div>

    <ng-content></ng-content>
  `
})
export class NotificationLabelComponent {
  @Input() tooltipText: string;
  @Input() showNotification = true;
  @Input() notificationPlacement = 'start';
  @Input() notificationDisabled = false;
  @Input() pulse = false;
  @HostBinding('class.reverse') @Input() reverse: boolean;

  @Output() viewed = new EventEmitter();

  getPopoverTrigger(): NbTrigger {
    if (this.notificationDisabled) {
      return NbTrigger.NOOP;
    }
    return NbTrigger.HINT;
  }
}
