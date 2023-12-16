import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ShareApiService } from './share-api.service';
import { ShareRoutingModule } from './share-routing.module';
import { ShareComponent } from './share.component';
import { NotFoundModule } from '../not-found/not-found.module';
import { PreviewComponent } from './preview.component';

@NgModule({
  imports: [CommonModule, ShareRoutingModule, NotFoundModule],
  providers: [ShareApiService],
  declarations: [ShareComponent, PreviewComponent]
})
export class ShareModule {
}
