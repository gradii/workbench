import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AnalyticsService, Theme } from '@common';

@Component({
  selector       : 'len-shadow-settings',
  styleUrls      : ['./shadow-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-checkbox
      [value]="theme.shadow !== 'none'"
      (checkedChange)="updateShadow($event)"
      [disabled]="!extendedSettingsAvailable"
    >
      <span class="label">Add shadows to components</span>
    </tri-checkbox>
  `
})
export class ShadowSettingsComponent {
  @Input() theme: Theme;
  @Input() extendedSettingsAvailable: boolean;
  @Output() shadowChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private analytics: AnalyticsService) {
  }

  updateShadow(enabled: boolean) {
    this.analytics.logChangeShadow(enabled);
    this.shadowChange.emit(enabled);
  }
}
