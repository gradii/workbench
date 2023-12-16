import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbAlertModule, NbButtonModule, NbIconModule, NbInputModule, NbSpinnerModule } from '@nebular/theme';
import { BakeryCommonModule } from '@common';

import { ProfileComponent } from './profile.component';
import { ProfileFacade } from '@account-state/profile/profile.facade';

@NgModule({
  imports: [
    CommonModule,
    NbButtonModule,
    NbInputModule,
    NbSpinnerModule,
    NbAlertModule,
    NbIconModule,
    ReactiveFormsModule,
    RouterModule,
    BakeryCommonModule
  ],
  declarations: [ProfileComponent],
  providers: [ProfileFacade]
})
export class ProfileModule {
}
