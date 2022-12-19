import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BakeryCommonModule } from '@common';
import { TriAccordionModule } from '@gradii/triangle/accordion';
import { TriCheckboxModule } from '@gradii/triangle/checkbox';
import { TriFormModule } from '@gradii/triangle/form';
import { TriInputModule } from '@gradii/triangle/input';
import { TriLayoutModule } from '@gradii/triangle/layout';
import { TriTabsModule } from '@gradii/triangle/tabs';
import { ThemeApiService } from '@tools-state/theme/theme-api.service';
import { ImageColorService } from './color-logo/image-color.service';

import { ColorModalComponent } from './color-modal/color-modal.component';
import { ColorModalService } from './color-modal/color-modal.service';
import { ColorPaletteComponent } from './color-palette/color-palette.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorPickerService } from './color-picker/color-picker.service';
import { ColorSliderDirective } from './color-picker/color-slider.directive';
import { PainterRoutingModule } from './painter-routing.module';
import { PainterComponent } from './painter.component';
import { ShapeSettingsComponent } from './shape-settings/shape-settings.component';
import { DeleteThemeComponent } from './theme-list/delete-theme.component';
import { NewThemeComponent } from './theme-list/new-theme.component';
import { RenameThemeComponent } from './theme-list/rename-theme.component';
import { ThemeItemComponent } from './theme-list/theme-item.component';
import { ThemePreviewComponent } from './theme-list/theme-preview.component';
import { ThemeListComponent } from './theme-list/theme-list.component';
import { PainterPanelComponent } from './painter-panel/painter-panel.component';
import { BasicColorComponent } from './palette-settings/basic-color.component';
import { ColorInputComponent } from './color-input/color-input.component';
import { ColorPreviewComponent } from './color-preview/color-preview.component';
import { ColorShadesComponent } from './palette-settings/color-shades.component';
import { OtherColorsComponent } from './palette-settings/other-colors.component';
import { PrimaryColorComponent } from './palette-settings/primary-color.component';
import { SupportColorsComponent } from './palette-settings/support-colors.component';
import { PaletteSettingsComponent } from './palette-settings/palette-settings.component';
import { UniqueThemeNameValidator } from './theme-list/theme.validators';
import { ThemeSettingsComponent } from './theme-settings/theme-settings.component';
import { ShadowSettingsComponent } from './shape-settings/shadow-settings.component';
import { RadiusSettingsComponent } from './shape-settings/radius-settings.component';
import { ColorLogoComponent } from './color-logo/color-logo.component';
import { ThemeTextSettingsComponent } from './theme-text-settings/theme-text-settings.component';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriButtonModule } from '@gradii/triangle/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PainterRoutingModule,
        BakeryCommonModule,
        FormsModule,
        ReactiveFormsModule,
        TriIconModule,
        TriButtonModule,
        TriLayoutModule,
        TriInputModule,
        TriTabsModule,
        TriAccordionModule,
        TriFormModule,
        TriCheckboxModule
    ],
    declarations: [
        PainterPanelComponent,
        ThemeListComponent,
        ThemeItemComponent,
        ThemePreviewComponent,
        ThemeSettingsComponent,
        ColorPreviewComponent,
        PrimaryColorComponent,
        ColorShadesComponent,
        ColorPaletteComponent,
        SupportColorsComponent,
        OtherColorsComponent,
        ColorInputComponent,
        PainterComponent,
        BasicColorComponent,
        ColorPickerComponent,
        ColorSliderDirective,
        ColorModalComponent,
        PaletteSettingsComponent,
        ShapeSettingsComponent,
        ShadowSettingsComponent,
        RadiusSettingsComponent,
        NewThemeComponent,
        RenameThemeComponent,
        DeleteThemeComponent,
        ColorLogoComponent,
        ThemeTextSettingsComponent
    ],
    providers: [
        ColorPickerService,
        ColorModalService,
        ThemeApiService,
        UniqueThemeNameValidator,
        ImageColorService,
    ]
})
export class PainterModule {
}
