import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActiveBreakpointProvider, BakeryCommonModule, StylesCompilerService } from '@common/public-api';
import { TriAccordionModule } from '@gradii/triangle/accordion';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriButtonToggleModule } from '@gradii/triangle/button-toggle';
import { TriCardModule } from '@gradii/triangle/card';
import { TriCheckboxModule } from '@gradii/triangle/checkbox';
import { TriComboboxModule } from '@gradii/triangle/combobox';
import { TriDiagramModule } from '@gradii/triangle/diagram';
import { TriDialogModule } from '@gradii/triangle/dialog';
import { TriDndModule } from '@gradii/triangle/dnd';
import { TriFormFieldModule } from '@gradii/triangle/form-field';
import { TriGridModule } from '@gradii/triangle/grid';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriInputModule } from '@gradii/triangle/input';
import { TriInputNumberModule } from '@gradii/triangle/input-number';
import { TriMenuModule } from '@gradii/triangle/menu';
import { TriPopoverModule } from '@gradii/triangle/popover';
import { TriRadioModule } from '@gradii/triangle/radio';
import { TriSelectModule } from '@gradii/triangle/select';
import { TriSidenavModule } from '@gradii/triangle/sidenav';
import { TriTabsModule } from '@gradii/triangle/tabs';
import { TriTagModule } from '@gradii/triangle/tag';
import { TriTooltipModule } from '@gradii/triangle/tooltip';
import { TriTreeViewModule } from '@gradii/triangle/tree-view';
import { ToolsSharedModule } from '@tools-shared/tools-shared.module';
import { ActionDiagramInspectionComponent } from './action-diagram-inspection/action-diagram-inspection.component';
import {
  ActionInspectionInfoComponent
} from './action-diagram-inspection/action-inspection-info/action-inspection-info.component';
import { BakeryActiveBreakpointProvider } from './active-breakpoint-provider';
import { ActionNodesModule } from './builder-action/action-nodes/action-nodes.module';
import { BuilderActionComponent } from './builder-action/builder-action.component';
import { AddCustomTriggerComponent } from './builder-action/dialogs/add-custom-trigger.component';
import { AddScopeTriggerComponent } from './builder-action/dialogs/add-scope-trigger.component';
import { ScopeEventBoxComponent } from './builder-action/scope-event-box/scope-event-box.component';
import { ScopeTriggerBoxComponent } from './builder-action/scope-trigger-box/scope-trigger-box.component';
import { ScopeVariableBoxComponent } from './builder-action/scope-variable-box/scope-variable-box.component';

import { BuilderRoutingModule } from './builder-routing.module';
import { BuilderComponent } from './builder.component';
import { AccordionControllerDirective } from './component-inspection/accordion-controller.directive';
import { BindingLabelContainerComponent } from './component-inspection/binding-label/binding-label-container.component';
import { ComponentInspectionComponent } from './component-inspection/component-inspection.component';
import { AccordionEditorComponent } from './component-inspection/components/accordion-editor.component';
import { BarChartEditorComponent } from './component-inspection/components/bar-chart-editor.component';
import { BubbleMapEditorComponent } from './component-inspection/components/bubble-map-editor.component';
import { ButtonEditorComponent } from './component-inspection/components/button-editor.component';
import { ButtonLinkEditorComponent } from './component-inspection/components/button-link-editor.component';
import { CalendarEditorComponent } from './component-inspection/components/calendar-editor.component';
import { CardEditorComponent } from './component-inspection/components/card-editor.component';
import { CheckboxEditorComponent } from './component-inspection/components/checkbox-editor.component';
import { DatepickerEditorComponent } from './component-inspection/components/datepicker-editor.component';
import { DividerEditorComponent } from './component-inspection/components/divider-editor.component';
import { DoughnutChartEditorComponent } from './component-inspection/components/doughnut-chart-editor.component';
import { HeaderEditorComponent } from './component-inspection/components/header-editor.component';
import { HeadingEditorComponent } from './component-inspection/components/heading-editor.component';
import { IconEditorComponent } from './component-inspection/components/icon-editor.component';
import { IframeEditorComponent } from './component-inspection/components/iframe-editor.component';
import { ImageEditorComponent } from './component-inspection/components/image-editor.component';
import { InputEditorComponent } from './component-inspection/components/input-editor.component';
import { LinkEditorComponent } from './component-inspection/components/link-editor.component';
import { ListEditorComponent } from './component-inspection/components/list-editor.component';
import { MapEditorComponent } from './component-inspection/components/map-editor.component';
import { MenuEditorComponent } from './component-inspection/components/menu-editor.component';
import {
  MultipleAxisChartEditorComponent
} from './component-inspection/components/multiple-axis-chart-editor.component';
import { MultipleBarChartEditorComponent } from './component-inspection/components/multiple-bar-chart-editor.component';
import { ProgressBarEditorComponent } from './component-inspection/components/progress-bar-editor.component';
import { RadioEditorComponent } from './component-inspection/components/radio-editor.component';
import { SelectEditorComponent } from './component-inspection/components/select-editor.component';
import { SidebarEditorComponent } from './component-inspection/components/sidebar-editor.component';
import { SlotEditorComponent } from './component-inspection/components/slot-editor.component';
import { SmartTableEditorComponent } from './component-inspection/components/smart-table-editor.component';
import { SpaceEditorComponent } from './component-inspection/components/space-editor.component';
import { StepperEditorComponent } from './component-inspection/components/stepper-editor.component';
import { TableEditorComponent } from './component-inspection/components/table-editor.component';
import { TabsEditorComponent } from './component-inspection/components/tabs-editor.component';
import { TextEditorComponent } from './component-inspection/components/text-editor.component';
import { EditorDirective } from './component-inspection/editor.directive';
import { FeatureEditorDirective } from './component-inspection/feature-editor.directive';
import { SpaceFeatureEditorComponent } from './component-inspection/features/space-feature-editor.component';
import { ActionInputComponent } from './component-inspection/fields/action-settings-field/action-input.component';
import { ActionParamComponent } from './component-inspection/fields/action-settings-field/action-param.component';
import {
  ActionsListSettingsFieldComponent
} from './component-inspection/fields/action-settings-field/actions-list-settings-field.component';
import {
  AddNewActionButtonComponent
} from './component-inspection/fields/action-settings-field/add-new-action-button.component';
import { BackgroundSettingsFieldComponent } from './component-inspection/fields/background-settings-field.component';
import { ButtonGroupSettingsFieldComponent } from './component-inspection/fields/button-group-settings-field.component';
import { CheckboxSettingsFieldComponent } from './component-inspection/fields/checkbox-settings-field.component';
import {
  ColorSettingsFieldComponent, ColorSettingsFieldOptionComponent
} from './component-inspection/fields/color-dropdown.component';
import {
  ComponentNameSettingsFieldComponent
} from './component-inspection/fields/component-name-settings-field.component';
import { ComponentTypeFieldComponent } from './component-inspection/fields/component-type-field.component';
import { DataBindingFieldComponent } from './component-inspection/fields/data-field/data-binding-field.component';
import {
  DataFormatHintComponent
} from './component-inspection/fields/data-format-settings-field/data-format-hint.component';
import {
  DataFormatModalComponent
} from './component-inspection/fields/data-format-settings-field/data-format-modal.component';
import {
  DataSourceSettingFieldComponent
} from './component-inspection/fields/data-sources-setting-field/data-source-settings-field.component';
import { DropdownSettingsFieldComponent } from './component-inspection/fields/dropdown-settings-field.component';
import {
  FormFieldWidthSettingsFieldComponent
} from './component-inspection/fields/form-field-width-settings-field.component';
import { GapSettingsFieldComponent } from './component-inspection/fields/gap-settings-field.component';
import { IconSettingsFieldComponent } from './component-inspection/fields/icon-settings-field.component';
import { IconSizeSettingsFieldComponent } from './component-inspection/fields/icon-size-settings-field.component';
import { ImageSrcSettingsFieldComponent } from './component-inspection/fields/image-src-settings-field.component';
import {
  ForSettingFieldComponent
} from './component-inspection/fields/logic-operators-setting-field/for-setting-field.component';
import {
  IfSettingFieldComponent
} from './component-inspection/fields/logic-operators-setting-field/if-setting-field.component';
import { MarginPaddingComponent } from './component-inspection/fields/margin-padding.component';
import { MarginValueComponent } from './component-inspection/fields/margin-value.component';
import { NavigationActionSettingsFieldComponent } from './component-inspection/fields/navigation-action.component';
import { NumberSettingsFieldComponent } from './component-inspection/fields/number-settings-field.component';
import { OptionsSettingsFieldComponent } from './component-inspection/fields/options-settings-field.component';
import { OverflowSettingsFieldComponent } from './component-inspection/fields/overflow-settings-field.component';
import { PaddingValueComponent } from './component-inspection/fields/padding-value.component';
import {
  PositionGroupSettingsFieldComponent
} from './component-inspection/fields/position-group-settings-field.component';
import { RadiusSettingsFieldComponent } from './component-inspection/fields/radius-settings-field.component';
import { SizeInputComponent } from './component-inspection/fields/size-input.component';
import { SizeSettingsFieldComponent } from './component-inspection/fields/size-settings-field.component';
import { SpaceAlignFieldComponent } from './component-inspection/fields/space-align-field.component';
import { SpaceDirectionFieldComponent } from './component-inspection/fields/space-direction-field.component';
import { SpaceGapFieldComponent } from './component-inspection/fields/space-gap-field.component';
import { SpaceJustifyFieldComponent } from './component-inspection/fields/space-justify-field.component';
import { SpaceSizeFieldComponent } from './component-inspection/fields/space-size-field.component';
import { SpaceWrapFieldComponent } from './component-inspection/fields/space-wrap-field.component';
import {
  TableOptionsSettingsFieldComponent
} from './component-inspection/fields/table-options-settings-field.component';
import { TextSettingsFieldComponent } from './component-inspection/fields/text-settings-field.component';
import { TextStyleComponent } from './component-inspection/fields/text-style.component';
import { OverlayDetachHandlerService } from './component-inspection/overlay-detach-handler.service';
import { OverlayRegisterDirective } from './component-inspection/overlay-register.directive';
import { SettingLabelContainerComponent } from './component-inspection/setting-label/setting-label-container.component';
import { TabsControllerDirective } from './component-inspection/tabs-controller.directive';
import { ComponentsTreePanelComponent } from './components-tree-panel/components-tree-panel.component';
import { TreeElementListComponent } from './components-tree-panel/tree-element-list.component';
import { TreeElementComponent } from './components-tree-panel/tree-element.component';
import { LayoutEditorComponent } from './layout-panel/layout-editor.component';
import { LayoutPanelComponent } from './layout-panel/layout-panel.component';
import { LayoutTypeComponent } from './layout-panel/layout-type.component';
import { NavigatorPanelComponent } from './navigator-panel/navigator-panel.component';
import { PageCreateDialogComponent } from './page-create-dialog/page-create-dialog.component';
import { PageCreateComponent } from './page-create/page-create.component';
import { PageFormComponent } from './page-form/page-form.component';
import { PageCheckHelperService } from './page-import/page-check-helper.service';
import { PageImportDialogComponent } from './page-import/page-import-dialog.component';
import { PageImportPageTreeComponent } from './page-import/page-import-page-tree.component';
import { PageFilterComponent } from './page-panel/page-filter.component';
import { PagePanelComponent } from './page-panel/page-panel.component';
import { PageTreeComponent } from './page-tree/page-tree.component';
import { PageComponent } from './page-tree/page.component';
import { PageUpdateComponent } from './page-update/page-update.component';
import { ComponentsFilterComponent } from './puff-components-tree/components-panel/components-filter.component';
import { ComponentsPanelComponent } from './puff-components-tree/components-panel/components-panel.component';
import { PuffComponentsTreeComponent } from './puff-components-tree/puff-components-tree.component';
import { PuffPageTreeComponent } from './puff-page-tree/puff-page-tree.component';
import { PuffStructureTreeComponent } from './puff-structure-tree/puff-structure-tree.component';
import { TestComp } from './test-comp';

const SETTINGS_COMPONENTS = [
  TextEditorComponent,
  ButtonEditorComponent,
  ButtonLinkEditorComponent,
  ProgressBarEditorComponent,
  InputEditorComponent,
  CheckboxEditorComponent,
  CardEditorComponent,
  CalendarEditorComponent,
  LinkEditorComponent,
  SpaceEditorComponent,
  SelectEditorComponent,
  StepperEditorComponent,
  TabsEditorComponent,
  RadioEditorComponent,
  TableEditorComponent,
  SmartTableEditorComponent,
  HeadingEditorComponent,
  ImageEditorComponent,
  IconEditorComponent,
  MultipleAxisChartEditorComponent,
  MultipleBarChartEditorComponent,
  DoughnutChartEditorComponent,
  BubbleMapEditorComponent,
  BarChartEditorComponent,
  MapEditorComponent,
  AccordionEditorComponent,
  ListEditorComponent,
  SpaceSizeFieldComponent,
  DatepickerEditorComponent,
  HeaderEditorComponent,
  SidebarEditorComponent,
  MenuEditorComponent,
  IframeEditorComponent,
  DividerEditorComponent,
  SlotEditorComponent,

  SpaceFeatureEditorComponent
];

@NgModule({
  imports     : [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    BuilderRoutingModule,
    BakeryCommonModule,
    ToolsSharedModule,

    TriMenuModule,

    TriTabsModule,
    TriIconModule,
    TriAccordionModule,
    TriButtonModule,
    TriTooltipModule,
    TriCardModule,
    TriPopoverModule,
    TriDialogModule,
    TriDndModule,
    TriSidenavModule,
    TriInputModule,
    TriInputNumberModule,
    TriCheckboxModule,
    TriSelectModule,
    TriRadioModule,
    TriComboboxModule,
    TriButtonToggleModule,
    TriDiagramModule,
    TriFormFieldModule,
    TriGridModule,
    TriTagModule,
    TriTreeViewModule,

    ActionNodesModule,

    PortalModule
  ],
  declarations: [
    ...SETTINGS_COMPONENTS,
    ComponentInspectionComponent,
    TextSettingsFieldComponent,
    DropdownSettingsFieldComponent,
    NumberSettingsFieldComponent,
    CheckboxSettingsFieldComponent,
    ColorSettingsFieldComponent,
    ButtonGroupSettingsFieldComponent,
    PositionGroupSettingsFieldComponent,
    OptionsSettingsFieldComponent,
    TableOptionsSettingsFieldComponent,
    NavigationActionSettingsFieldComponent,
    ColorSettingsFieldOptionComponent,
    SizeSettingsFieldComponent,
    GapSettingsFieldComponent,
    SpaceDirectionFieldComponent,
    SpaceJustifyFieldComponent,
    SpaceAlignFieldComponent,
    SpaceWrapFieldComponent,
    SpaceGapFieldComponent,
    RadiusSettingsFieldComponent,
    OverflowSettingsFieldComponent,
    IconSettingsFieldComponent,
    IconSizeSettingsFieldComponent,
    FormFieldWidthSettingsFieldComponent,
    SizeInputComponent,
    PagePanelComponent,
    PageFormComponent,
    PageUpdateComponent,
    PageCreateComponent,
    PageCreateDialogComponent,
    PageTreeComponent,
    PageComponent,
    BuilderComponent,
    BuilderActionComponent,
    PageFilterComponent,
    LayoutPanelComponent,
    LayoutEditorComponent,
    LayoutTypeComponent,
    EditorDirective,
    FeatureEditorDirective,
    OverlayRegisterDirective,
    BackgroundSettingsFieldComponent,
    PageImportDialogComponent,
    PageImportPageTreeComponent,
    ImageSrcSettingsFieldComponent,
    ActionsListSettingsFieldComponent,
    ActionParamComponent,
    ActionInputComponent,
    AddNewActionButtonComponent,
    DataSourceSettingFieldComponent,
    IfSettingFieldComponent,
    ForSettingFieldComponent,
    DataFormatHintComponent,
    DataFormatModalComponent,
    BindingLabelContainerComponent,
    SettingLabelContainerComponent,
    MarginValueComponent,
    PaddingValueComponent,
    MarginPaddingComponent,
    ComponentsTreePanelComponent,
    TreeElementComponent,
    TreeElementListComponent,
    NavigatorPanelComponent,
    TextStyleComponent,
    ComponentNameSettingsFieldComponent,
    ComponentTypeFieldComponent,
    AccordionControllerDirective,
    TabsControllerDirective,
    DataBindingFieldComponent,

    TestComp,
    ScopeVariableBoxComponent,
    ScopeEventBoxComponent,
    ScopeTriggerBoxComponent,

    AddScopeTriggerComponent,
    AddCustomTriggerComponent,

    ActionDiagramInspectionComponent,
    ActionInspectionInfoComponent,

    PuffPageTreeComponent,
    PuffStructureTreeComponent,
    PuffComponentsTreeComponent,

    ComponentsPanelComponent,
    ComponentsFilterComponent,

  ],
  exports     : [
    TabsControllerDirective
  ],
  providers   : [
    OverlayDetachHandlerService,
    PageCheckHelperService,
    StylesCompilerService,
    {
      provide : ActiveBreakpointProvider,
      useClass: BakeryActiveBreakpointProvider
    }
  ]
})
export class BuilderModule {
}
