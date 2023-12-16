import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTooltipModule,
  NbRouteTabsetModule
} from '@nebular/theme';
import { BakeryCommonModule } from '@common';

import { AccountCommonModule } from '../common/common.module';
import { ProjectsComponent } from './projects.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsGridComponent } from './projects-grid/projects-grid.component';
import { CreateProjectComponent } from './create-project-page/create-project-page.component';
import { DeleteProjectDialogComponent } from './delete-project-dialog/delete-project-dialog.component';
import { EditProjectDialogComponent } from './edit-project-dialog/edit-project-dialog.component';
import { ProjectActionsManagerFactoryService } from './project/project-actions-manager.service';
import { TemplateComponent } from './template/template.component';
import { CreateProjectDialogComponent } from './create-project-dialog/create-project-dialog.component';
import { TutorialSharedModule } from '@shared/tutorial/tutorial-shared.module';
import { DialogModule } from '@shared/dialog/dialog.module';
import { TutorialsReleasedNotificationComponent } from './tutorials-released-notification/tutorials-released-notification.component';
import { TutorialsReleasedNotificationService } from './tutorials-released-notification/tutorials-released-notification.service';
import { RequestTemplateComponent } from './request-template/request-template.component';
import { ProjectDialogActionsService } from './project/project-dialog-actions.service';

@NgModule({
  imports: [
    CommonModule,

    BakeryCommonModule,
    AccountCommonModule,
    DialogModule,

    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbContextMenuModule,
    NbActionsModule,
    NbButtonModule,
    NbInputModule,
    NbTooltipModule,
    NbSpinnerModule,
    NbIconModule,
    RouterModule,
    TutorialSharedModule,
    NbSelectModule,
    NbFormFieldModule
  ],
  declarations: [
    ProjectsComponent,
    ProjectComponent,
    ProjectsGridComponent,
    CreateProjectDialogComponent,
    CreateProjectComponent,
    TemplateComponent,
    DeleteProjectDialogComponent,
    EditProjectDialogComponent,
    TutorialsReleasedNotificationComponent,
    RequestTemplateComponent
  ],
  entryComponents: [
    CreateProjectDialogComponent,
    DeleteProjectDialogComponent,
    EditProjectDialogComponent,
    TutorialsReleasedNotificationComponent,
    RequestTemplateComponent
  ],
  providers: [ProjectActionsManagerFactoryService, ProjectDialogActionsService, TutorialsReleasedNotificationService]
})
export class ProjectsModule {
}
