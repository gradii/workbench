import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbIconModule,
  NbRouteTabsetModule,
  NbInputModule,
  NbAlertModule,
  NbSpinnerModule,
  NbCardModule
} from '@nebular/theme';
import { BakeryCommonModule } from '@common';
import { BkPipeModule } from '@uibakery/kit';

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
    NbAlertModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbRouteTabsetModule,
    NbSpinnerModule,
    NbCardModule,
    RouterModule,
    BkPipeModule,
    SimpleCodeEditorModule
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
