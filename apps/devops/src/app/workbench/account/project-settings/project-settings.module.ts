import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BakeryCommonModule } from '@common';
import { TriAlertModule } from '@gradii/triangle/alert';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCardModule } from '@gradii/triangle/card';
import { TriIconModule } from '@gradii/triangle/icon';

import { AccountCommonModule } from '../common/common.module';
import { ProjectSettingsComponent } from '../project-settings/project-settings.component';
import { ProjectSettingsGeneralComponent } from '../project-settings/project-settings-general/project-settings-general.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { ProjectSettingsCodeComponent } from './project-settings-code/project-settings-code.component';
import { SimpleCodeEditorModule } from '@shared/code-editor/simple-code-editor.module';
import { ProjectSettingsHostingComponent } from './project-settings-hosting/project-settings-hosting.component';
import { AddDomainComponent } from './add-domain/add-domain.component';
import { DomainCardComponent } from './domain-card/domain-card.component';
import { DeleteDomainDialogComponent } from './delete-domain-dialog/delete-domain-dialog.component';
import { DistanceToNowPipe } from './distance-to-now.pipe';

@NgModule({
  imports: [
    CommonModule,

    BakeryCommonModule,
    AccountCommonModule,
    ReactiveFormsModule,
    RouterModule,
    SimpleCodeEditorModule,
    TriIconModule,
    TriButtonModule,
    TriAlertModule,
    TriCardModule
  ],
  declarations: [
    ProjectSettingsComponent,
    ProjectSettingsGeneralComponent,
    ImageUploadComponent,
    ImagePreviewComponent,
    ProjectSettingsCodeComponent,
    ProjectSettingsHostingComponent,
    AddDomainComponent,
    DomainCardComponent,
    DeleteDomainDialogComponent,
    DistanceToNowPipe
  ]
})
export class ProjectSettingsModule {
}
