import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbPopoverModule,
  NbRadioModule,
  NbSelectModule,
  NbTabsetModule,
  NbTooltipModule
} from '@nebular/theme';
import { BakeryCommonModule } from '@common';

import { ErrorNotificationComponent } from './error-notification/error-notification.component';
import { WorkflowListItemComponent } from './workflow-list-item/workflow-list-item.component';
import { StepErrorItemComponent } from './workflow-settings/step-settings/step-errors/step-error-item.component';
import { StepErrorListComponent } from './workflow-settings/step-settings/step-errors/step-error-list.component';
import { WorkflowToolComponent } from './workflow-tool.component';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import { WorkflowListHeaderComponent } from './workflow-list-header/workflow-list-header.component';
import { WorkflowListFilterComponent } from './workflow-list-filter/workflow-list-filter.component';
import { WorkflowSettingsComponent } from './workflow-settings/workflow-settings.component';
import { StepListComponent } from './workflow-settings/step-list/step-list.component';
import { StepListItemComponent } from './workflow-settings/step-list/step-list-item.component';
import { StepSettingsComponent } from './workflow-settings/step-settings/step-settings.component';
import { CodeStepSettingsComponent } from './workflow-settings/step-settings/code-step/code-step-settings.component';
import { AsyncCodeStepSettingsComponent } from './workflow-settings/step-settings/async-code-step/async-code-step-settings.component';
import { HttpStepSettingsComponent } from './workflow-settings/step-settings/http-step/http-step-settings.component';
import { SaveStepSettingsComponent } from './workflow-settings/step-settings/save-step/save-step-settings.component';
import { ToggleSidebarStepSettingsComponent } from './workflow-settings/step-settings/toggle-sidebar-step/toggle-sidebar-step-settings.component';
import { WorkflowSettingsHeaderComponent } from './workflow-settings/workflow-settings-header/workflow-settings-header.component';
import { StepItemComponent } from './workflow-settings/step-item/step-item.component';
import { StepTypeSelectComponent } from './workflow-settings/step-type-select/step-type-select.component';
import { HttpParamsControlComponent } from './workflow-settings/step-settings/http-step/http-params-control.component';
import { WorkflowCommonDialogComponent } from './dialog/workflow-common-dialog/workflow-common-dialog.component';
import { StateItemNameComponent } from './workflow-settings/step-settings/save-step/state-item-name.component';
import { NavigationStepSettingsComponent } from './workflow-settings/step-settings/navigation-step/navigation-step-settings.component';
import { WorkflowDialogService } from './dialog/workflow-dialog.service';
import { ToolsSharedModule } from '@tools-shared/tools-shared.module';
import { StepPropertiesComponent } from './workflow-settings/step-properties/step-properties.component';
import { StateManagerComponent } from './state-manager/state-manager.component';
import { StateManagerListComponent } from './state-manager/state-manager-list/state-manager-list.component';
import { StateManagerListFilterComponent } from './state-manager/state-manager-list-filter/state-manager-list-filter.component';
import { StateManagerListHeaderComponent } from './state-manager/state-manager-list-header/state-manager-list-header.component';
import { StateManagerListItemComponent } from './state-manager/state-manager-list-item/state-manager-list-item.component';
import { StateManagerDialogService } from './state-manager/dialog/state-manager-dialog.service';
import { StateManagerSettingsComponent } from './state-manager/state-manager-settings/state-manager-settings.component';
import { StateManagerSettingsHeaderComponent } from './state-manager/state-manager-settings-header/state-manager-settings-header.component';
import { StoreItemUtilService } from './util/store-item-util.service';
import { AddNewValueButtonComponent } from './workflow-settings/step-settings/save-step/add-new-value-button/add-new-value-button.component';
import { SaveLocalStepSettingsComponent } from './workflow-settings/step-settings/save-local-step/save-local-step-settings.component';
import { LocalStorageItemNameComponent } from './workflow-settings/step-settings/save-local-step/local-storage-item-name.component';
import { LocalStorageFacadeService } from './util/local-storage-facade.service';
import { StepListActionComponent } from './workflow-settings/step-list/step-list-action.component';
import { StepListGroupComponent } from './workflow-settings/step-list-group/step-list-group.component';
import { WorkflowSourceService } from './workflow-source.service';
import { ConditionStepSettingsComponent } from './workflow-settings/step-settings/condition-step/condition-step-settings.component';
import { ExecuteActionStepSettingsComponent } from './workflow-settings/step-settings/execute-action-step/execute-action-step-settings.component';

@NgModule({
  declarations: [
    WorkflowToolComponent,
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
    StateManagerSettingsComponent,
    StateManagerSettingsHeaderComponent,
    ErrorNotificationComponent,
    StepErrorListComponent,
    StepErrorItemComponent,
    StepPropertiesComponent,
    SaveLocalStepSettingsComponent,
    LocalStorageItemNameComponent,
    ExecuteActionStepSettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BakeryCommonModule,
    WorkflowRoutingModule,
    NbIconModule,
    NbButtonModule,
    NbInputModule,
    NbFormFieldModule,
    NbSelectModule,
    NbContextMenuModule,
    NbTabsetModule,
    NbRadioModule,
    NbCardModule,
    NbCheckboxModule,
    NbPopoverModule,
    ToolsSharedModule,
    NbTooltipModule
  ],
  providers: [
    WorkflowDialogService,
    StateManagerDialogService,
    StoreItemUtilService,
    WorkflowSourceService,
    LocalStorageFacadeService
  ],
  entryComponents: [
    WorkflowCommonDialogComponent,
    CodeStepSettingsComponent,
    AsyncCodeStepSettingsComponent,
    HttpStepSettingsComponent,
    SaveStepSettingsComponent,
    ToggleSidebarStepSettingsComponent,
    NavigationStepSettingsComponent,
    StateManagerComponent,
    ConditionStepSettingsComponent
  ]
})
export class WorkflowModule {
}
