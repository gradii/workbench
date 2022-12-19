import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BakeryCommonModule } from '@common';
import { TriAlertModule } from '@gradii/triangle/alert';
import { TriIconModule } from '@gradii/triangle/icon';

import { ProfileComponent } from './profile.component';
import { ProfileFacade } from '@account-state/profile/profile.facade';

@NgModule({
  imports: [
    CommonModule,

    ReactiveFormsModule,
    RouterModule,
    BakeryCommonModule,
    TriAlertModule,
    TriIconModule
  ],
  declarations: [ProfileComponent],
  providers: [ProfileFacade]
})
export class ProfileModule {
}
