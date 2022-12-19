import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BakeryCommonModule } from '@common/public-api';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCardModule } from '@gradii/triangle/card';
import { TriDataTableModule } from '@gradii/triangle/data-table';
import { TriFormModule } from '@gradii/triangle/form';
import { TriFormFieldModule } from '@gradii/triangle/form-field';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriInputModule } from '@gradii/triangle/input';
import { TriMenuModule } from '@gradii/triangle/menu';
import { TriPopoverModule } from '@gradii/triangle/popover';
import { TriRadioModule } from '@gradii/triangle/radio';
import { TriSelectModule } from '@gradii/triangle/select';
import { TriTabsModule } from '@gradii/triangle/tabs';
import { TriTooltipModule } from '@gradii/triangle/tooltip';
import { ToolsSharedModule } from '@tools-shared/tools-shared.module';
import { WorkflowCommonDialogComponent } from './dialog/workflow-common-dialog/workflow-common-dialog.component';
import { WorkflowDialogService } from './dialog/workflow-dialog.service';

import { ErrorNotificationComponent } from './error-notification/error-notification.component';
import { StateManagerDialogService } from './state-manager/dialog/state-manager-dialog.service';
import {
  StateManagerListFilterComponent
} from './state-manager/state-manager-list-filter/state-manager-list-filter.component';
import {
  StateManagerListHeaderComponent
} from './state-manager/state-manager-list-header/state-manager-list-header.component';
import {
  StateManagerListItemComponent
} from './state-manager/state-manager-list-item/state-manager-list-item.component';
import { StateManagerListComponent } from './state-manager/state-manager-list/state-manager-list.component';
import {
  StateManagerSettingsHeaderComponent
} from './state-manager/state-manager-settings-header/state-manager-settings-header.component';
import { VariableManageFormComponent } from './state-manager/variable-manage-form/variable-manage-form.component';
import { StateManagerComponent } from './state-manager/state-manager.component';
import {
  VariableManageReferenceComponent
} from './state-manager/variable-manage-reference/variable-manage-reference.component';
import { LocalStorageFacadeService } from './util/local-storage-facade.service';
import { StoreItemUtilService } from './util/store-item-util.service';
import { WorkflowListFilterComponent } from './workflow-list-filter/workflow-list-filter.component';
import { WorkflowListHeaderComponent } from './workflow-list-header/workflow-list-header.component';
import { WorkflowListItemComponent } from './workflow-list-item/workflow-list-item.component';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import { StepItemComponent } from './workflow-settings/step-item/step-item.component';
import { StepListGroupComponent } from './workflow-settings/step-list-group/step-list-group.component';
import { StepListActionComponent } from './workflow-settings/step-list/step-list-action.component';
import { StepListItemComponent } from './workflow-settings/step-list/step-list-item.component';
import { StepListComponent } from './workflow-settings/step-list/step-list.component';
import { StepPropertiesComponent } from './workflow-settings/step-properties/step-properties.component';
import {
  AsyncCodeStepSettingsComponent
} from './workflow-settings/step-settings/async-code-step/async-code-step-settings.component';
import { CodeStepSettingsComponent } from './workflow-settings/step-settings/code-step/code-step-settings.component';
import {
  ConditionStepSettingsComponent
} from './workflow-settings/step-settings/condition-step/condition-step-settings.component';
import {
  ExecuteActionStepSettingsComponent
} from './workflow-settings/step-settings/execute-action-step/execute-action-step-settings.component';
import { HttpParamsControlComponent } from './workflow-settings/step-settings/http-step/http-params-control.component';
import { HttpStepSettingsComponent } from './workflow-settings/step-settings/http-step/http-step-settings.component';
import {
  NavigationStepSettingsComponent
} from './workflow-settings/step-settings/navigation-step/navigation-step-settings.component';
import {
  LocalStorageItemNameComponent
} from './workflow-settings/step-settings/save-local-step/local-storage-item-name.component';
import {
  SaveLocalStepSettingsComponent
} from './workflow-settings/step-settings/save-local-step/save-local-step-settings.component';
import {
  AddNewValueButtonComponent
} from './workflow-settings/step-settings/save-step/add-new-value-button/add-new-value-button.component';
import { SaveStepSettingsComponent } from './workflow-settings/step-settings/save-step/save-step-settings.component';
import { StateItemNameComponent } from './workflow-settings/step-settings/save-step/state-item-name.component';
import { StepErrorItemComponent } from './workflow-settings/step-settings/step-errors/step-error-item.component';
import { StepErrorListComponent } from './workflow-settings/step-settings/step-errors/step-error-list.component';
import { StepSettingsComponent } from './workflow-settings/step-settings/step-settings.component';
import {
  ToggleSidebarStepSettingsComponent
} from './workflow-settings/step-settings/toggle-sidebar-step/toggle-sidebar-step-settings.component';
import { StepTypeSelectComponent } from './workflow-settings/step-type-select/step-type-select.component';
import {
  WorkflowSettingsHeaderComponent
} from './workflow-settings/workflow-settings-header/workflow-settings-header.component';
import { WorkflowSettingsComponent } from './workflow-settings/workflow-settings.component';
import { WorkflowSourceService } from './workflow-source.service';
import { TriDialogModule } from '@gradii/triangle/dialog';
import { TriTagModule } from '@gradii/triangle/tag';

const COMPONENTS = [
  WorkflowListComponent,
  WorkflowListHeaderComponent,
  WorkflowListFilterComponent,
  WorkflowListItemComponent,
  WorkflowSettingsComponent,
  StepListComponent,
  StepListGroupComponent,
  StepListActionComponent,
  StepListItemComponent,
  StepSettingsComponent,
  CodeStepSettingsComponent,
  AsyncCodeStepSettingsComponent,
  ConditionStepSettingsComponent,
  HttpStepSettingsComponent,
  SaveStepSettingsComponent,
  ToggleSidebarStepSettingsComponent,
  WorkflowSettingsHeaderComponent,
  StepItemComponent,
  StepTypeSelectComponent,
  HttpParamsControlComponent,
  WorkflowCommonDialogComponent,
  StateItemNameComponent,
  NavigationStepSettingsComponent,
  AddNewValueButtonComponent,
  StateManagerComponent,
  StateManagerListComponent,
  StateManagerListFilterComponent,
  StateManagerListHeaderComponent,
  StateManagerListItemComponent,
  VariableManageFormComponent,
  VariableManageReferenceComponent,
  StateManagerSettingsHeaderComponent,
  ErrorNotificationComponent,
  StepErrorListComponent,
  StepErrorItemComponent,
  StepPropertiesComponent,
  SaveLocalStepSettingsComponent,
  LocalStorageItemNameComponent,
  ExecuteActionStepSettingsComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BakeryCommonModule,
    ToolsSharedModule,

    TriIconModule,
    TriCardModule,
    TriFormModule,
    TriButtonModule,
    TriTabsModule,
    TriRadioModule,
    TriMenuModule,
    TriInputModule,
    TriPopoverModule,
    TriSelectModule,
    TriFormFieldModule,
    TriTooltipModule,
    TriDialogModule,
    TriDataTableModule,
    TriTagModule
  ],
  providers   : [
    WorkflowDialogService,
    StateManagerDialogService,
    StoreItemUtilService,
    WorkflowSourceService,
    LocalStorageFacadeService
  ],
  exports     : [
    ...COMPONENTS
  ]
})
export class WorkflowCommonModule {

}