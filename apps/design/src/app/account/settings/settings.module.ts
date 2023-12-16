import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbRouteTabsetModule } from '@nebular/theme';

import { AccountCommonModule } from '../common/common.module';
import { SettingsComponent } from './settings.component';

@NgModule({
  imports: [CommonModule, NbRouteTabsetModule, NbButtonModule, AccountCommonModule],
  declarations: [SettingsComponent]
})
export class SettingsModule {
}
