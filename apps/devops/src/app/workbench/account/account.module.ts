import { AccountEffects } from '@account-state/account.effects';
import { fromAccount } from '@account-state/account.reducer';
import { ProfileService } from '@account-state/profile/profile.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BakeryCommonModule } from '@common';
import { EffectsNgModule } from '@ngneat/effects-ng';
import { AccountRoutingModule } from './account-routing.module';

import { AccountComponent } from './account.component';
import { AccountCommonModule } from './common/common.module';
import { DesignModule } from './design/design.module';
import { ProfileModule } from './profile/profile.module';
// import { BillingModule } from './billing/billing.module';
import { ProjectSettingsModule } from './project-settings/project-settings.module';
import { ProjectsModule } from './projects/projects.module';
import { SettingsModule } from './settings/settings.module';

@NgModule({
  imports     : [
    CommonModule,
    BakeryCommonModule,
    AccountRoutingModule,

    DesignModule,

    ProjectsModule,
    ProjectSettingsModule,
    SettingsModule,
    ProfileModule,
    // BillingModule,


    AccountCommonModule,

    EffectsNgModule.forFeature(fromAccount.ReducerEffects),
    EffectsNgModule.forFeature(AccountEffects)
  ],
  declarations: [AccountComponent],
  providers   : [ProfileService]
})
export class AccountModule {
}
