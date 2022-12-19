import { NgModule } from '@angular/core';
import { DcsQueueRunner } from './services/dcs-queue-runner.service';
import { DataTableFilterService } from './services/data-table-filter-service';
import { ShowRequestModalComponent } from './modal/show-request-modal.component';
import { CommonModule } from '@angular/common';


@NgModule({
  imports     : [
    CommonModule
  ],
  declarations: [
    ShowRequestModalComponent
  ],
  providers   : [
    DcsQueueRunner,
    DataTableFilterService

  ],
  exports     : [
    ShowRequestModalComponent
  ]
})
export class SharedModule {

}
