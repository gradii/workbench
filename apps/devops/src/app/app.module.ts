import { OverlayContainer, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UbAuthStrategy } from '@auth/auth-strategy.service';
import { UbAuthService } from '@auth/auth.service';
import { filterInterceptorRequest } from '@auth/filter-interceptor-request';
import {
  AclModule, AnalyticsHandler, DevAnalyticsHandler, ENVIRONMENT, ProdAnalyticsHandler, SentryErrorHandler
} from '@common';
// import { RoleProvider } from '@core/acl/role-provider';
import { TokenFailedLogoutInterceptor } from '@core/token-failed-logout-interceptor.service';
import { UpgradeModule } from '@core/upgrade/upgrade.module';

import { PushNotificationsModule } from '@devops-tools/push-notifications';
import { environment } from '@environments';
import {
  TRI_AUTH_TOKEN_INTERCEPTOR_FILTER, TriAuthJWTInterceptor, TriAuthModule, TriAuthOAuth2JWTToken, TriAuthService,
  TriPasswordAuthStrategyOptions
} from '@gradii/triangle/auth';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriLayoutModule } from '@gradii/triangle/layout';
import { TriMessageModule } from '@gradii/triangle/message';
import { TriNavbarModule } from '@gradii/triangle/navbar';
import { TriNotificationModule } from '@gradii/triangle/notification';
import { TriRoleProvider } from '@gradii/triangle/security';
import { TriSidenavModule } from '@gradii/triangle/sidenav';
import { KitchenModule } from '@kitchen';
import { EffectsNgModule } from '@ngneat/effects-ng';
import { devTools } from '@ngneat/elf-devtools';

import { RootEffects } from '@root-state/effects';
import { fromRoot } from '@root-state/root.reducer';
import { of } from 'rxjs';
import { AppNavbarComponent } from './app-navbar.component';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AppSideBarComponent } from './app.sidebar.component';
// import { ENV_MODULES } from './env-module/env.module';
import { HomeWorkbenchComponent } from './home-workbench/home-workbench.component';
import { HomeComponent } from './home/home.component';
import { ApiHostForwardInterceptor } from './interceptor/api-host-forward.interceptor';
import { BusinessErrorInterceptor } from './interceptor/business-error.interceptor';
import { HttpParamsCodecInterceptor } from './interceptor/http-params-codec.interceptor';
import { NotFoundModule } from './not-found/not-found.module';
import { ProjectPreloadResolver } from './playground/play-api/project-preload-resolver.service';
import { PuffAppModule } from './puff-app/puff-app-module';
import { SharedModule } from './shared/shared.module';

export function authErrorGetter(module: string, res: HttpErrorResponse, options: TriPasswordAuthStrategyOptions) {
  return res.error;
}

// if(!environment.production) {
devTools();

// }

@NgModule({
  declarations: [
    AppComponent,
    AppNavbarComponent,
    AppSideBarComponent,
    // DcsComponent,

    HomeComponent,
    HomeWorkbenchComponent
  ],
  imports     : [
    FormsModule,
    BrowserAnimationsModule,

    HttpClientModule,
    PushNotificationsModule,

    TriNavbarModule,
    TriNotificationModule,
    TriMessageModule,

    PuffAppModule,

    SharedModule,
    AppRoutingModule,

    // StoreModule.forRoot(fromRoot.reducers, {
    //   runtimeChecks: {
    //     strictStateImmutability    : !environment.production,
    //     strictActionImmutability   : !environment.production,
    //     strictStateSerializability : false,
    //     strictActionSerializability: false
    //   }
    // }),
    EffectsNgModule.forRoot(fromRoot.ReducerEffects),
    // ENV_MODULES,
    EffectsNgModule.forRoot(RootEffects),

    TriAuthModule.forRoot({
      strategies: [
        UbAuthStrategy.setup({
          name        : 'email',
          baseEndpoint: `/api/auth`,
          token       : {
            class: TriAuthOAuth2JWTToken,
            key  : 'token'
          },
          login       : {
            endpoint         : '/login',
            requireValidToken: true
          },
          register    : {
            endpoint         : '/register',
            requireValidToken: true,
            redirect         : { success: '/auth/welcome' }
          },
          logout      : {
            endpoint         : '/logout',
            requireValidToken: true
          },
          refreshToken: {
            endpoint         : '/refresh-token',
            requireValidToken: true
          },
          requestPass : {
            endpoint: '/forgot-password'
          },
          resetPass   : {
            endpoint: '/reset-password'
          },
          errors      : {
            key   : 'data.errors',
            getter: authErrorGetter
          }
        })
      ]
    }),

    AclModule,


    NotFoundModule,
    UpgradeModule,
    AclModule,

    TriIconModule,
    TriSidenavModule,
    TriButtonModule,
    TriLayoutModule

  ],
  providers   : [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: ENVIRONMENT, useValue: environment },

    { provide: ErrorHandler, useClass: SentryErrorHandler },
    ProjectPreloadResolver,

    { provide: AnalyticsHandler, useClass: environment.production ? ProdAnalyticsHandler : DevAnalyticsHandler },
    { provide: ErrorHandler, useClass: SentryErrorHandler },

    { provide: HTTP_INTERCEPTORS, useClass: HttpParamsCodecInterceptor, multi: true, deps: [] },
    { provide: HTTP_INTERCEPTORS, useClass: ApiHostForwardInterceptor, multi: true, deps: [] },
    { provide: HTTP_INTERCEPTORS, useClass: BusinessErrorInterceptor, multi: true, deps: [] },

    { provide: HTTP_INTERCEPTORS, useClass: TriAuthJWTInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenFailedLogoutInterceptor, multi: true, deps: [] },
    { provide: TRI_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: filterInterceptorRequest },
    // { provide: USER_PROVIDED_META_REDUCERS, useValue: rootMetaReducers },
    // TriAuthService,
    { provide: TriAuthService, useClass: UbAuthService },
    { provide: AnalyticsHandler, useClass: environment.production ? ProdAnalyticsHandler : DevAnalyticsHandler },
    // { provide: TriRoleProvider, useClass: RoleProvider },
    {
      provide: TriRoleProvider, useFactory: () => {
        return new class extends TriRoleProvider {
          getRole() {
            return of(['admin']);
          }
        };
      }
    },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    { provide: OverlayContainer, useClass: OverlayContainer },
    // { provide: OverlayContainer, useClass: Kitchen2OverlayContainer },
    { provide: ScrollStrategyOptions, useClass: ScrollStrategyOptions }

  ],
  exports     : [
    AppNavbarComponent,
    AppSideBarComponent
  ],
  bootstrap   : [AppComponent]
})
export class AppModule {
}
