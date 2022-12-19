import { NgModule } from "@angular/core";
import { TriCommonModule } from "@gradii/triangle/core";
import { CommonModule } from "@angular/common";
import { TriButtonModule } from "@gradii/triangle/button";
import { TriDndModule } from '@gradii/triangle/dnd';
import { TriInputModule } from "@gradii/triangle/input";

@NgModule({
  imports: [
    CommonModule,
    TriCommonModule,
    TriButtonModule,
    TriInputModule,
    TriDndModule,
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class ButtonModule {

}
