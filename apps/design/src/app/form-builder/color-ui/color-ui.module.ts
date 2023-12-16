import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbIconModule, NbInputModule, NbTabsetModule } from '@nebular/theme';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerService } from './color-picker/color-picker.service';
import { ColorModalService } from './color-modal/color-modal.service';
import { ImageColorService } from './color-logo/image-color.service';
import { ColorPreviewComponent } from './color-preview/color-preview.component';
import { ColorInputComponent } from './color-input/color-input.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorSliderDirective } from './color-picker/color-slider.directive';
import { ColorModalComponent } from './color-modal/color-modal.component';
import { ColorLogoComponent } from './color-logo/color-logo.component';
import { ColorShadesComponent } from './color-shades/color-shades.component';
import { ColorPaletteComponent } from './color-palette/color-palette.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbTabsetModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule
  ],
  providers: [ColorPickerService, ColorModalService, ImageColorService],
  declarations: [
    ColorPreviewComponent,
    ColorInputComponent,
    ColorPickerComponent,
    ColorSliderDirective,
    ColorModalComponent,
    ColorLogoComponent,
    ColorShadesComponent,
    ColorPaletteComponent
  ],
  entryComponents: [ColorModalComponent],
  exports: [
    ColorPreviewComponent,
    ColorInputComponent,
    ColorPickerComponent,
    ColorSliderDirective,
    ColorModalComponent,
    ColorLogoComponent,
    ColorShadesComponent,
    ColorPaletteComponent
  ]
})
export class ColorUiModule {
}
