import { NgModule } from '@angular/core';

import { EchartsDirective } from './echarts.directive';

@NgModule({
  declarations: [EchartsDirective],
  exports: [EchartsDirective]
})
export class EchartsModule {
}
