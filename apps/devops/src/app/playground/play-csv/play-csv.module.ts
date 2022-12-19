import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayCsvRoutingModule } from './play-csv-routing.module';
import { ParseCsvComponent } from './parse-csv/parse-csv.component';
import { FormsModule } from '@angular/forms';
import { TriButtonModule } from '@gradii/triangle/button';


@NgModule({
  declarations: [ParseCsvComponent],
  imports: [
    CommonModule,
    PlayCsvRoutingModule,
    FormsModule,

    TriButtonModule
  ]
})
export class PlayCsvModule {
}
