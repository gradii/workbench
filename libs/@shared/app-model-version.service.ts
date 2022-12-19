import { Injectable } from '@angular/core';
import { AnalyticsService, getModelVersion } from '@common/public-api';

@Injectable({ providedIn: 'root' })
export class AppModelVersionService {
  public currentVersion: number = getModelVersion();

  constructor(private analyticsService: AnalyticsService) {
  }

  verify(version: number) {
    if (version !== this.currentVersion) {
      this.analyticsService.logModelVersionMismatch();
      console.warn(`Newer version is available.`);
      // location.reload(true);
    }
  }
}
