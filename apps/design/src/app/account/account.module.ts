import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule,
  NbButtonModule,
  NbContextMenuModule,
  NbIconModule,
  NbLayoutModule,
  NbRouteTabsetModule,
  NbUserModule
} from '@nebular/theme';
import { BakeryCommonModule } from '@common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AccountEffects } from '@account-state/account.effects';
import { fromAccount } from '@account-state/account.reducer';
import { ProfileService } from '@account-state/profile/profile.service';

import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';
import { ProjectsModule } from './projects/projects.module';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header.component';
import { AccountCommonModule } from './common/common.module';
import { SettingsModule } from './settings/settings.module';
import { ProfileModule } from './profile/profile.module';
import { BillingModule } from './billing/billing.module';
import { ProjectSettingsModule } from './project-settings/project-settings.module';

@NgModule({
  imports: [
    CommonModule,
    BakeryCommonModule,
    AccountRoutingModule,

    ProjectsModule,
    ProjectSettingsModule,
    SettingsModule,
    ProfileModule,
    BillingModule,

    NbLayoutModule,
    NbUserModule,
    NbContextMenuModule,
    NbActionsModule,
    NbButtonModule,
    NbRouteTabsetModule,
    NbIconModule,

    AccountCommonModule,

    StoreModule.forFeature('account', fromAccount.reducers),
    EffectsModule.forFeature(AccountEffects)
  ],
  declarations: [AccountComponent, LayoutComponent, HeaderComponent],
  providers: [ProfileService]
})
export class AccountModule {
}
