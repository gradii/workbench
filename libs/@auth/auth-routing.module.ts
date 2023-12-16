import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LogoutComponent } from './logout/logout.component';
import { ConfirmEmailChangeComponent } from './confirm-email-change/confirm-email-change.component';
import { OAuth2CallbackComponent } from './oauth2/oauth2-callback.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { animation: 'LoginPage' }
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: { animation: 'RegisterPage' }
      },
      {
        path: 'logout',
        component: LogoutComponent,
        data: { animation: 'LogoutPage' }
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        data: { animation: 'ResetPasswordPage' }
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: { animation: 'RequestPasswordPage' }
      },
      {
        path: 'oauth2/callback',
        component: OAuth2CallbackComponent
      },
      {
        path: 'welcome',
        component: WelcomeComponent,
        data: { animation: 'WelcomePage' }
      },
      {
        path: 'confirm-email-change',
        component: ConfirmEmailChangeComponent,
        data: { animation: 'ConfirmEmailChange' }
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
