import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BakeryCommonModule } from '@common';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCardModule } from '@gradii/triangle/card';
import { TriDialogModule } from '@gradii/triangle/dialog';
import { TriFormModule } from '@gradii/triangle/form';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriInputModule } from '@gradii/triangle/input';
import { TriSelectModule } from '@gradii/triangle/select';
import { TriTooltipModule } from '@gradii/triangle/tooltip';
import { TriBadgeModule } from '@gradii/triangle/badge';

import { AccountCommonModule } from '../common/common.module';
import { CreateProjectDialogComponent } from './create-project-dialog/create-project-dialog.component';
import { CreateProjectComponent } from './create-project-page/create-project-page.component';
import { DeleteProjectDialogComponent } from './delete-project-dialog/delete-project-dialog.component';
import { EditProjectDialogComponent } from './edit-project-dialog/edit-project-dialog.component';
import { ProjectActionsManagerFactoryService } from './project/project-actions-manager.service';
import { ProjectDialogActionsService } from './project/project-dialog-actions.service';
import { ProjectComponent } from './project/project.component';
import { ProjectsGridComponent } from './projects-grid/projects-grid.component';
import { ProjectsComponent } from './projects.component';
import { RequestTemplateComponent } from './request-template/request-template.component';
import { TemplateComponent } from './template/template.component';
import { TriTagModule } from '@gradii/triangle/tag';
import { TriPaginationModule } from '@gradii/triangle/pagination';
import { TriFormFieldModule } from '@gradii/triangle/form-field';

@NgModule({
  imports: [
    CommonModule,

    BakeryCommonModule,
    AccountCommonModule,

    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    TriButtonModule,
    TriIconModule,
    TriDialogModule,
    TriCardModule,
    TriInputModule,
    TriTooltipModule,
    TriBadgeModule,
    TriTagModule,
    TriPaginationModule,
    TriFormModule,
    TriSelectModule,
    TriFormFieldModule

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

    RequestTemplateComponent
  ],
  exports     : [
    ProjectsComponent
  ],
  providers   : [
    ProjectActionsManagerFactoryService,
    ProjectDialogActionsService
  ]
})
export class ProjectsModule {
}
