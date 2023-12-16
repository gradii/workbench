import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnalyticsService } from '@common';

@Component({
  selector: 'ub-tour-progress-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tour-progress-control.component.scss'],
  template: `
    <ng-template #tourProgress>
      <ub-tour-progress-container></ub-tour-progress-container>
    </ng-template>

    <button
      nbButton
      size="small"
      status="success"
      [nbPopover]="tourProgress"
      (nbPopoverShowStateChange)="logTutorialProgressShowStateChange($event)"
      nbPopoverOffset="10"
      nbPopoverClass="tour-progress-popover"
    >
      Lessons Progress
      <bc-icon name="chevron-down-outline"></bc-icon>
    </button>
  `
})
export class TourProgressControlComponent {
  constructor(private analytics: AnalyticsService) {
  }

  logTutorialProgressShowStateChange({ isShown }): void {
    if (isShown) {
      this.analytics.logTutorialProgressOpened();
    }
  }
}
