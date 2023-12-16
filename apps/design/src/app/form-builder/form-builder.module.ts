import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCheckboxModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbRadioModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbTabsetModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import { BakeryCommonModule } from '@common';
import { FormBuilderService } from './form-builder.service';
import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { FormBuilderComponent } from './form-builder.component';
import { PreviewComponent } from './preview.component';
import { FieldsConfiguratorService } from './fields-configurator/fields-configurator.service';
import { StylesConfiguratorService } from './styles-configurator/styles-configurator.service';
import { BuilderTabsComponent } from './builder-tabs/builder-tabs.component';
import { TemplatesListComponent } from './templates-list/templates-list.component';
import { TemplateComponent } from './template/template.component';
import { FieldComponent, FieldsConfiguratorComponent } from './fields-configurator/fields-configurator.component';
import { StylesConfiguratorComponent } from './styles-configurator/styles-configurator.component';
import { ColorUiModule } from './color-ui/color-ui.module';
import { DownloadFormDialogComponent } from './dialogs/download-form-dialog.component';
import { ContinueEditingDialogComponent } from './dialogs/continue-editing-dialog.component';
import { WelcomeDialogComponent } from './dialogs/welcome-dialog.component';

@NgModule({
  imports: [
    BakeryCommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbTabsetModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    FormBuilderRoutingModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbIconModule,
    NbDialogModule.forChild(),
    ColorUiModule,
    NbDialogModule,
    NbCheckboxModule,
    NbRadioModule,
    ReactiveFormsModule,
    NbSidebarModule,
    NbSpinnerModule
  ],
  providers: [FormBuilderService, FieldsConfiguratorService, StylesConfiguratorService],
  declarations: [
    BuilderTabsComponent,
    TemplatesListComponent,
    TemplateComponent,
    FieldsConfiguratorComponent,
    FieldComponent,
    StylesConfiguratorComponent,
    FormBuilderComponent,
    PreviewComponent,
    DownloadFormDialogComponent,
    ContinueEditingDialogComponent,
    WelcomeDialogComponent
  ],
  entryComponents: [DownloadFormDialogComponent, ContinueEditingDialogComponent, WelcomeDialogComponent]
})
export class FormBuilderModule {
}
