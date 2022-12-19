import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { TriggerType } from '@gradii/triangle/tooltip/src/tooltip.common';
import { TooltipPosition } from '@gradii/triangle/tooltip/src/tooltip.interface';

@Component({
  selector       : 'pf-notification-label',
  styleUrls      : ['./notification-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <div
      class="point-container"
      *ngIf="showNotification"
      [triTooltip]="tooltipText"
      [triTooltipPosition]="notificationPlacement"
      [triTooltipTrigger]="getPopoverTrigger()"
      (mouseenter)="viewed.emit()"
    >
      <div [class.pulse]="pulse" class="point" [class.disabled]="notificationDisabled"></div>
    </div>

    <ng-content></ng-content>
  `
})
export class NotificationLabelComponent {
  @Input() tooltipText: string;
  @Input() showNotification                       = true;
  @Input() notificationPlacement: TooltipPosition = 'left';
  @Input() notificationDisabled                   = false;
  @Input() pulse                                  = false;
  @HostBinding('class.reverse') @Input() reverse: boolean;

  @Output() viewed = new EventEmitter();

  getPopoverTrigger(): TriggerType {
    if (this.notificationDisabled) {
      return TriggerType.NOOP;
    }
    return TriggerType.HOVER;
  }
}
