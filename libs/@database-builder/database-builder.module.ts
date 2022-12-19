import { NgModule } from '@angular/core';
import { TriCardModule } from '@gradii/triangle/card';
import { TriDialogModule } from '@gradii/triangle/dialog';
import { DatabaseManageComponent } from './database-manage/database-manage.component';
import { DatabaseBuilderDialogService } from './dialog/database-builder-dialog.service';


@NgModule({
  imports     : [
    TriDialogModule,
    TriCardModule
  ],
  declarations: [
    DatabaseManageComponent
  ],
  providers   : [
    DatabaseBuilderDialogService,
  ],
  exports     : [
    DatabaseManageComponent,
  ]
})
export class DatabaseBuilderModule {

}