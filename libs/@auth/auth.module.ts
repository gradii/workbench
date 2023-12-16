import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NbAuthModule } from '@nebular/auth';

import { AuthRoutingModule } from './auth-routing.module';

import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbSelectModule,
  NbSpinnerModule
} from '@nebular/theme';
import { BakeryCommonModule } from '@common';

import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LogoutComponent } from './logout/logout.component';
import { ConfirmEmailChangeComponent } from './confirm-email-change/confirm-email-change.component';
import { OAuth2CallbackComponent } from './oauth2/oauth2-callback.component';
import { ConfirmRegisterComponent } from './confirm-register/confirm-register.component';
import { CouponModule } from '@shared/redeem-coupon/coupon.module';
import { TutorialSharedModule } from '@shared/tutorial/tutorial-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbAlertModule,
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    NbCheckboxModule,
    AuthRoutingModule,
    NbLayoutModule,
    BakeryCommonModule,
    NbAuthModule,
    NbSpinnerModule,
    NbIconModule,
    NbCardModule,
    CouponModule,
    TutorialSharedModule
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
    OAuth2CallbackComponent,
    ConfirmRegisterComponent
  ]
})
export class AuthModule {
}
