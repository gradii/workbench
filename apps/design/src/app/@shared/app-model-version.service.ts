import { Injectable } from '@angular/core';
import { AnalyticsService, getModelVersion } from '@common';

@Injectable({ providedIn: 'root' })
export class AppModelVersionService {
  public currentVersion: number = getModelVersion();

  constructor(private analyticsService: AnalyticsService) {
  }

  verify(version: number) {
    if (version !== this.currentVersion) {
      this.analyticsService.logModelVersionMismatch();
      alert(`Newer version is available. Let's reload the page, it will take a second.`);
      location.reload(true);
    }
  }
}
