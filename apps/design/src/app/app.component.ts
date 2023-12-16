import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AnalyticsService, FeatureHiderService } from '@common';

@Component({
  selector: 'ub-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.scss'],
  template: ` <router-outlet></router-outlet> `
})
export class AppComponent implements OnInit {
  constructor(private analytics: AnalyticsService, private featureHider: FeatureHiderService) {
  }

  ngOnInit() {
    this.analytics.init();
    this.featureHider.init();
  }
}
