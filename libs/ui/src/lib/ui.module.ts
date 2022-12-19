import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalComponent } from './terminal/terminal.component';
import { TerminalFactory } from './terminal/terminal.factory';

const PUBLIC_DECLARATIONS = [
  TerminalComponent
];

@NgModule({
  imports     : [
    CommonModule
  ],
  declarations: [
    ...PUBLIC_DECLARATIONS
  ],
  providers   : [
    TerminalFactory
  ],
  exports     : [
    ...PUBLIC_DECLARATIONS
  ]
})
export class UiModule {
}
