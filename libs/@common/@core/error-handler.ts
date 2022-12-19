// import * as Sentry from '@sentry/browser';
// import { BrowserOptions } from '@sentry/browser';
import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';

import { Environment, ENVIRONMENT } from '../environment';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  private analyticsService: AnalyticsService;

  constructor(@Inject(ENVIRONMENT) private environment: Environment, private injector: Injector) {
  }

  handleError(error: Error) {
    // if (this.environment.production) {
    //   // Sentry.captureException(error);
    // } else {
      console.error(error);
    // }

    if (this.analyticsService !== null) {
      this.analyticsService = this.injector.get(AnalyticsService, null);
    }

    // TODO fix
    if (this.analyticsService) {
      this.analyticsService.logErrorOccurred(error);
      console.error(error);
    } else {
      throw error;
    }
  }
}

// export function sentryWithFeedback(options: BrowserOptions) {
//   initSentry({
//     ...options,
//     beforeSend(event) {
//       if (event.exception) {
//         Sentry.showReportDialog({ eventId: event.event_id });
//       }
//       return event;
//     }
//   });
// }

// export function sentryWithoutFeedback(options: BrowserOptions) {
//   initSentry({ ...options });
// }
//
// function initSentry(options: BrowserOptions) {
//   // Sentry.init({
//   //   ...options,
//   //   dsn: 'https://xxedefffffffffffffffff@.io/11111119999'
//   // });
// }
