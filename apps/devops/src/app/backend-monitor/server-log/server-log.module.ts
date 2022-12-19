import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerLogRoutingModule } from './server-log-routing.module';
import { ApiLogComponent } from './api-log/api-log.component';
import { UiModule } from '@devops-tools/ui';
import { SampleApiLogComponent } from './sample-api-log/sample-api-log.component';


@NgModule({
  declarations: [ApiLogComponent, SampleApiLogComponent],
  imports     : [
    CommonModule,
    ServerLogRoutingModule,
    UiModule
  ]
})
export class ServerLogModule {
}
