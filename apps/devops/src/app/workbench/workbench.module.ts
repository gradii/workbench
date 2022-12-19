import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DISPLAY_ICONS } from '@gradii/triangle-icons/display/display.icons';
import { IconRegistry } from '@gradii/triangle/icon';
import { WorkbenchRoutingModule } from './workbench-routing.module';
import { CommonModule } from '@angular/common';
import { WorkbenchComponent } from './workbench.component';
import { BakeryCommonModule } from '@common';

@NgModule({
  declarations: [
    WorkbenchComponent,
  ],
  imports     : [
    CommonModule,
    WorkbenchRoutingModule,
    BakeryCommonModule,
  ],
  providers   : []
})
export class WorkbenchModule {

  constructor(
    iconRegistry: IconRegistry,
    sanitizer: DomSanitizer
  ) {

    import('@gradii/triangle-icons/eva').then(it => {
      const { EVA_FILL_SVG_ICONS, EVA_OUTLINE_SVG_ICONS } = it;

      iconRegistry.addSvgIconSetLiteralInNamespace(
        'eva-fill',
        sanitizer.bypassSecurityTrustHtml(EVA_FILL_SVG_ICONS));
      iconRegistry.addSvgIconSetLiteralInNamespace(
        'eva-outline',
        sanitizer.bypassSecurityTrustHtml(EVA_OUTLINE_SVG_ICONS));
    });

    import('@gradii/triangle-icons/display').then(it => {
      const { DISPLAY_ICONS } = it;
      iconRegistry.addSvgIconSetLiteralInNamespace(
        'display',
        sanitizer.bypassSecurityTrustHtml(DISPLAY_ICONS));
    });

  }
}
