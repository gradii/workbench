import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TriAuthModule } from '@gradii/triangle/auth';
import { TriButtonModule } from '@gradii/triangle/button';

import { AuthRoutingModule } from './auth-routing.module';

import { BakeryCommonModule } from '@common/public-api';

import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LogoutComponent } from './logout/logout.component';
import { ConfirmEmailChangeComponent } from './confirm-email-change/confirm-email-change.component';
import { ConfirmRegisterComponent } from './confirm-register/confirm-register.component';
import { TriAlertModule } from '@gradii/triangle/alert';
import { TriInputModule } from '@gradii/triangle/input';
import { TriCheckboxModule } from '@gradii/triangle/checkbox';
import { TriSelectModule } from '@gradii/triangle/select';
import { TriLayoutModule } from '@gradii/triangle/layout';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriCardModule } from '@gradii/triangle/card';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TriAlertModule,
    TriInputModule,
    TriSelectModule,
    TriButtonModule,
    TriCheckboxModule,
    AuthRoutingModule,
    TriLayoutModule,
    BakeryCommonModule,
    TriAuthModule,
    // TriSpinnerModule,
    TriIconModule,
    TriCardModule
    // CouponModule,

  ],
  exports: [
    AuthComponent
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    WelcomeComponent,
    LogoutComponent,
    ConfirmEmailChangeComponent,
    ConfirmRegisterComponent
  ]
})
export class AuthModule {
}
