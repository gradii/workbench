import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminGuard } from './admin-guard.service';
import { NbActionsModule, NbLayoutModule } from '@nebular/theme';

@NgModule({
  imports: [CommonModule, AdminRoutingModule, NbLayoutModule, NbActionsModule],
  declarations: [AdminComponent],
  providers: [AdminGuard]
})
export class AdminModule {
}
