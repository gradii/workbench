import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackendMonitorRoutingModule } from './backend-monitor-routing.module';
import { UiModule } from '@devops-tools/ui';

@NgModule({
  declarations: [],
  imports     : [
    CommonModule,
    UiModule,
    BackendMonitorRoutingModule
  ]
})
export class BackendMonitorModule {
}
