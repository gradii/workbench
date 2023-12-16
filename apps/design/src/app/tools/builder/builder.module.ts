import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAccordionModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbOverlayModule,
  NbPopoverModule,
  NbSelectModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbTooltipModule
} from '@nebular/theme';
import { ActiveBreakpointProvider, BakeryCommonModule, StylesCompilerService } from '@common';

import { BuilderRoutingModule } from './builder-routing.module';
import { BuilderComponent } from './builder.component';
import { ComponentSettingsComponent } from './component-settings/component-settings.component';
import { BarChartSettingsComponent } from './component-settings/components/bar-chart-settings.component';
import { ButtonLinkSettingsComponent } from './component-settings/components/button-link-settings.component';
import { ButtonSettingsComponent } from './component-settings/components/button-settings.component';
import { CalendarSettingsComponent } from './component-settings/components/calendar-settings.component';
import { CardSettingsComponent } from './component-settings/components/card-settings.component';
import { CheckboxSettingsComponent } from './component-settings/components/checkbox-settings.component';
import { HeaderSettingsComponent } from './component-settings/components/header-settings.component';
import { HeadingSettingsComponent } from './component-settings/components/heading-settings.component';
import { IconSettingsComponent } from './component-settings/components/icon-settings.component';
import { ImageSettingsComponent } from './component-settings/components/image-settings.component';
import { InputSettingsComponent } from './component-settings/components/input-settings.component';
import { LineChartSettingsComponent } from './component-settings/components/line-chart-settings.component';
import { LinkSettingsComponent } from './component-settings/components/link-settings.component';
import { ListSettingsComponent } from './component-settings/components/list-settings.component';
import { MapSettingsComponent } from './component-settings/components/map-settings.component';
import { MenuSettingsComponent } from './component-settings/components/menu-settings.component';
import { PieChartSettingsComponent } from './component-settings/components/pie-chart-settings.component';
import { MultipleAxisChartSettingsComponent } from './component-settings/components/multiple-axis-chart-settings.component';
import { MultipleBarChartSettingsComponent } from './component-settings/components/multiple-bar-chart-settings.component';
import { DoughnutChartSettingsComponent } from './component-settings/components/doughnut-chart-settings.component';
import { BubbleMapSettingsComponent } from './component-settings/components/bubble-map-settings.component';
import { ProgressBarSettingsComponent } from './component-settings/components/progress-bar-settings.component';
import { SelectSettingsComponent } from './component-settings/components/select-settings.component';
import { SidebarSettingsComponent } from './component-settings/components/sidebar-settings.component';
import { SpaceSettingsComponent } from './component-settings/components/space-settings.component';
import { TableSettingsComponent } from './component-settings/components/table-settings.component';
import { TabsSettingsComponent } from './component-settings/components/tabs-settings.component';
import { RadioSettingsComponent } from './component-settings/components/radio-settings.component';
import { TextSettingsComponent } from './component-settings/components/text-settings.component';
import { ActionsListSettingsFieldComponent } from './component-settings/fields/action-settings-field/actions-list-settings-field.component';
import { DataBindingFieldComponent } from './component-settings/fields/data-field/data-binding-field.component';
import { FormFieldWidthSettingsFieldComponent } from './component-settings/fields/form-field-width-settings-field.component';
import { IconSettingsFieldComponent } from './component-settings/fields/icon-settings-field.component';
import { IconSizeSettingsFieldComponent } from './component-settings/fields/icon-size-settings-field.component';
import { NavigationActionSettingsFieldComponent } from './component-settings/fields/navigation-action.component';
import { OptionsSettingsFieldComponent } from './component-settings/fields/options-settings-field.component';
import { OverflowSettingsFieldComponent } from './component-settings/fields/overflow-settings-field.component';
import { PositionGroupSettingsFieldComponent } from './component-settings/fields/position-group-settings-field.component';
import { ButtonGroupSettingsFieldComponent } from './component-settings/fields/button-group-settings-field.component';
import { CheckboxSettingsFieldComponent } from './component-settings/fields/checkbox-settings-field.component';
import { DropdownSettingsFieldComponent } from './component-settings/fields/dropdown-settings-field.component';
import { NumberSettingsFieldComponent } from './component-settings/fields/number-settings-field.component';
import { RadiusSettingsFieldComponent } from './component-settings/fields/radius-settings-field.component';
import { SizeInputComponent } from './component-settings/fields/size-input.component';
import { SizeSettingsFieldComponent } from './component-settings/fields/size-settings-field.component';
import {
  ColorSettingsFieldComponent,
  ColorSettingsFieldOptionComponent
} from './component-settings/fields/color-dropdown.component';
import { TableOptionsSettingsFieldComponent } from './component-settings/fields/table-options-settings-field.component';
import { SmartTableSettingsComponent } from './component-settings/components/smart-table-settings.component';
import { TextSettingsFieldComponent } from './component-settings/fields/text-settings-field.component';
import { OverlayDetachHandlerService } from './component-settings/overlay-detach-handler.service';
import { OverlayRegisterDirective } from './component-settings/overlay-register.directive';
import { LayoutPanelComponent } from './layout-panel/layout-panel.component';
import { LayoutSettingsComponent } from './layout-panel/layout-settings.component';
import { LayoutTypeComponent } from './layout-panel/layout-type.component';
import { PageCreateComponent } from './page-create/page-create.component';
import { PageUpdateComponent } from './page-update/page-update.component';
import { PageFilterComponent } from './page-panel/page-filter.component';
import { PageTreeComponent } from './page-tree/page-tree.component';
import { PageComponent } from './page-tree/page.component';
import { PagePanelComponent } from './page-panel/page-panel.component';
import { PageFormComponent } from './page-form/page-form.component';
import { SettingsDirective } from './component-settings/settings.directive';
import { AccordionSettingsComponent } from './component-settings/components/accordion-settings.component';
import { BackgroundSettingsFieldComponent } from './component-settings/fields/background-settings-field.component';
import { SpaceDirectionFieldComponent } from './component-settings/fields/space-direction-field.component';
import { SpaceJustifyFieldComponent } from './component-settings/fields/space-justify-field.component';
import { SpaceAlignFieldComponent } from './component-settings/fields/space-align-field.component';
import { SpaceSizeFieldComponent } from './component-settings/fields/space-size-field.component';
import { PageCheckHelperService } from './page-import/page-check-helper.service';
import { PageImportDialogComponent } from './page-import/page-import-dialog.component';
import { PageImportPageTreeComponent } from './page-import/page-import-page-tree.component';
import { ImageSrcSettingsFieldComponent } from './component-settings/fields/image-src-settings-field.component';
import { DatepickerSettingsComponent } from './component-settings/components/datepicker-settings.component';
import { IframeSettingsComponent } from './component-settings/components/iframe-settings.component';
import { BakeryActiveBreakpointProvider } from './active-breakpoint-provider';
import { SettingLabelContainerComponent } from './component-settings/setting-label/setting-label-container.component';
import { DividerSettingsComponent } from './component-settings/components/divider-settings.component';
import { MarginValueComponent } from './component-settings/fields/margin-value.component';
import { PaddingValueComponent } from './component-settings/fields/padding-value.component';
import { MarginPaddingComponent } from './component-settings/fields/margin-padding.component';
import { ComponentsTreePanelComponent } from './components-tree-panel/components-tree-panel.component';
import { TreeElementComponent } from './components-tree-panel/tree-element.component';
import { TreeElementListComponent } from './components-tree-panel/tree-element-list.component';
import { NavigatorPanelComponent } from './navigator-panel/navigator-panel.component';
import { StepperSettingsComponent } from './component-settings/components/stepper-settings.component';
import { TOOL_OVERLAY_CONTAINER_ADAPTER } from '../overlay-container';
import { ToastrModule } from '@shared/toastr/toastr.module';
import { TextStyleComponent } from './component-settings/fields/text-style.component';
import { AddNewActionButtonComponent } from './component-settings/fields/action-settings-field/add-new-action-button.component';
import { DataSourceSettingFieldComponent } from './component-settings/fields/data-sources-setting-field/data-source-settings-field.component';
import { ActionInputComponent } from './component-settings/fields/action-settings-field/action-input.component';
import { DataFormatHintComponent } from './component-settings/fields/data-format-settings-field/data-format-hint.component';
import { DataFormatModalComponent } from './component-settings/fields/data-format-settings-field/data-format-modal.component';
import { ComponentNameSettingsFieldComponent } from './component-settings/fields/component-name-settings-field.component';
import { ComponentTypeFieldComponent } from './component-settings/fields/component-type-field.component';
import { TabsControllerDirective } from './component-settings/tabs-controller.directive';
import { ToolsSharedModule } from '@tools-shared/tools-shared.module';
import { IfSettingFieldComponent } from './component-settings/fields/logic-operators-setting-field/if-setting-field.component';
import { ForSettingFieldComponent } from './component-settings/fields/logic-operators-setting-field/for-setting-field.component';
import { ActionParamComponent } from './component-settings/fields/action-settings-field/action-param.component';

const SETTINGS_COMPONENTS = [
  TextSettingsComponent,
  ButtonSettingsComponent,
  ButtonLinkSettingsComponent,
  ProgressBarSettingsComponent,
  InputSettingsComponent,
  CheckboxSettingsComponent,
  CardSettingsComponent,
  CalendarSettingsComponent,
  LinkSettingsComponent,
  SpaceSettingsComponent,
  SelectSettingsComponent,
  StepperSettingsComponent,
  TabsSettingsComponent,
  RadioSettingsComponent,
  TableSettingsComponent,
  SmartTableSettingsComponent,
  HeadingSettingsComponent,
  ImageSettingsComponent,
  IconSettingsComponent,
  LineChartSettingsComponent,
  PieChartSettingsComponent,
  MultipleAxisChartSettingsComponent,
  MultipleBarChartSettingsComponent,
  DoughnutChartSettingsComponent,
  BubbleMapSettingsComponent,
  BarChartSettingsComponent,
  MapSettingsComponent,
  AccordionSettingsComponent,
  ListSettingsComponent,
  SpaceSizeFieldComponent,
  DatepickerSettingsComponent,
  HeaderSettingsComponent,
  SidebarSettingsComponent,
  MenuSettingsComponent,
  IframeSettingsComponent,
  DividerSettingsComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbLayoutModule,
    NbCardModule,
    NbSidebarModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbTabsetModule,
    NbTooltipModule,
    NbCheckboxModule,
    NbAccordionModule,
    NbPopoverModule,
    NbOverlayModule,
    NbDialogModule.forChild(),
    NbIconModule,
    BuilderRoutingModule,
    BakeryCommonModule,
    NbSpinnerModule,
    NbIconModule,
    ToastrModule,
    ToolsSharedModule
  ],
  declarations: [
    ...SETTINGS_COMPONENTS,
    ComponentSettingsComponent,
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
    SpaceDirectionFieldComponent,
    SpaceJustifyFieldComponent,
    SpaceAlignFieldComponent,
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
    PageTreeComponent,
    PageComponent,
    BuilderComponent,
    PageFilterComponent,
    LayoutPanelComponent,
    LayoutSettingsComponent,
    LayoutTypeComponent,
    SettingsDirective,
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
    TabsControllerDirective,
    DataBindingFieldComponent
  ],
  providers: [
    OverlayDetachHandlerService,
    PageCheckHelperService,
    StylesCompilerService,
    { provide: ActiveBreakpointProvider, useClass: BakeryActiveBreakpointProvider },
    TOOL_OVERLAY_CONTAINER_ADAPTER
  ],
  entryComponents: [...SETTINGS_COMPONENTS, PageImportDialogComponent, DataFormatModalComponent]
})
export class BuilderModule {
}
