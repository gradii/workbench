import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KitchenModule } from '@kitchen';
import {
  AnalyticsHandler,
  DevAnalyticsHandler,
  ENVIRONMENT,
  getProjectVersion,
  ProdAnalyticsHandler,
  SentryErrorHandler,
  // sentryWithoutFeedback
} from '@common';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

// if (environment.production) {
//   sentryWithoutFeedback({ environment: environment.name, release: getProjectVersion() });
// }

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, KitchenModule],
  declarations: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: ENVIRONMENT, useValue: environment },
    { provide: AnalyticsHandler, useClass: environment.production ? ProdAnalyticsHandler : DevAnalyticsHandler },
    { provide: ErrorHandler, useClass: SentryErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
