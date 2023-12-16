import { APP_BASE_HREF } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbDialogModule, NbMenuModule, NbSidebarModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { StoreModule, USER_PROVIDED_META_REDUCERS } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  NB_AUTH_TOKEN_INTERCEPTOR_FILTER,
  NbAuthJWTInterceptor,
  NbAuthModule,
  NbAuthOAuth2JWTToken,
  NbAuthService,
  NbOAuth2AuthStrategy,
  NbOAuth2ResponseType,
  NbPasswordAuthStrategyOptions
} from '@nebular/auth';
import {
  AclModule,
  AnalyticsHandler,
  DevAnalyticsHandler,
  ENVIRONMENT,
  getProjectVersion,
  ProdAnalyticsHandler,
  SentryErrorHandler,
  sentryWithoutFeedback
} from '@common';
import { NbRoleProvider } from '@nebular/security';

import { fromRoot } from '@root-state/root.reducer';
import { RootEffects } from '@root-state/effects';
import { rootMetaReducers } from '@root-state/meta/meta-reducers';

import { AppComponent } from './app.component';
import { UpgradeModule } from '@core/upgrade/upgrade.module';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { filterInterceptorRequest } from '@auth/filter-interceptor-request';
import { UbAuthStrategy } from '@auth/auth-strategy.service';
import { NotFoundModule } from './not-found/not-found.module';
import { RoleProvider } from '@core/acl/role-provider';
import { UbAuthService } from '@auth/auth.service';
import { AccountThemeComponent } from './account-theme.component';
import { ToastrModule } from '@shared/toastr/toastr.module';
import { ChatInstance, MockChatInstance, ChatService } from '@core/chat.service';
import { TokenFailedLogoutInterceptor } from '@core/token-failed-logout-interceptor.service';

export function authErrorGetter(module: string, res: HttpErrorResponse, options: NbPasswordAuthStrategyOptions) {
  return res.error;
}

if (environment.production) {
  sentryWithoutFeedback({ environment: environment.name, release: getProjectVersion() });
}

const providers = environment.formBuilder
  ? [
    { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: filterInterceptorRequest },
    { provide: USER_PROVIDED_META_REDUCERS, useValue: rootMetaReducers },
    { provide: APP_BASE_HREF, useValue: environment.baseHref },
    { provide: ENVIRONMENT, useValue: environment },
    { provide: AnalyticsHandler, useClass: environment.production ? ProdAnalyticsHandler : DevAnalyticsHandler },
    { provide: ChatInstance, useClass: environment.production ? ChatInstance : MockChatInstance },
    ChatService,
    { provide: NbRoleProvider, useClass: RoleProvider },
    { provide: ErrorHandler, useClass: SentryErrorHandler }
  ]
  : [
    { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenFailedLogoutInterceptor, multi: true },
    { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: filterInterceptorRequest },
    { provide: USER_PROVIDED_META_REDUCERS, useValue: rootMetaReducers },
    { provide: APP_BASE_HREF, useValue: environment.baseHref },
    { provide: ENVIRONMENT, useValue: environment },
    { provide: NbAuthService, useClass: UbAuthService },
    { provide: AnalyticsHandler, useClass: environment.production ? ProdAnalyticsHandler : DevAnalyticsHandler },
    { provide: ChatInstance, useClass: environment.production ? ChatInstance : MockChatInstance },
    ChatService,
    { provide: NbRoleProvider, useClass: RoleProvider },
    { provide: ErrorHandler, useClass: SentryErrorHandler }
  ];

@NgModule({
  declarations: [AppComponent, AccountThemeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NbSidebarModule.forRoot(),
    NbThemeModule.forRoot(),
    NbDialogModule.forRoot(),
    NbMenuModule.forRoot(),
    NbToastrModule.forRoot(),
    ToastrModule.forRoot(),
    NbEvaIconsModule,
    StoreModule.forRoot(fromRoot.reducers, {
      runtimeChecks: {
        strictStateImmutability: !environment.production,
        strictActionImmutability: !environment.production,
        strictStateSerializability: false,
        strictActionSerializability: false
      }
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot(RootEffects),
    HttpClientModule,

    environment.formBuilder
      ? []
      : NbAuthModule.forRoot({
        strategies: [
          NbOAuth2AuthStrategy.setup({
            name: 'google',
            clientId: environment.auth.googleClientId,
            clientSecret: '',
            authorize: {
              endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
              responseType: NbOAuth2ResponseType.TOKEN,
              scope: 'profile email',
              redirectUri: `${environment.appServerName}/auth/oauth2/callback`
            },
            redirect: { success: '/projects' }
          }),

          UbAuthStrategy.setup({
            name: 'email',
            baseEndpoint: `${environment.apiUrl}/auth`,
            token: {
              class: NbAuthOAuth2JWTToken,
              key: 'token'
            },
            login: {
              endpoint: '/login',
              requireValidToken: true
            },
            register: {
              endpoint: '/register',
              requireValidToken: true,
              redirect: { success: '@auth/welcome' }
            },
            logout: {
              endpoint: '/logout',
              requireValidToken: true
            },
            refreshToken: {
              endpoint: '/refresh-token',
              requireValidToken: true
            },
            requestPass: {
              endpoint: '/forgot-password'
            },
            resetPass: {
              endpoint: '/reset-password'
            },
            errors: {
              key: 'data.errors',
              getter: authErrorGetter
            }
          })
        ]
      }),

    AppRoutingModule,
    NotFoundModule,
    UpgradeModule,
    AclModule
  ],
  providers: providers,
  bootstrap: [AppComponent]
})
export class AppModule {
}
