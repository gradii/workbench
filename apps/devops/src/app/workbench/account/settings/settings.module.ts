import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccountCommonModule } from '../common/common.module';
import { SettingsComponent } from './settings.component';

@NgModule({
  imports     : [CommonModule, AccountCommonModule],
  declarations: [SettingsComponent]
})
export class SettingsModule {
}
