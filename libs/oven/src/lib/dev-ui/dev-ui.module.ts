import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbOverlayModule,
  NbPopoverModule,
  NbTabsetModule,
  NbTooltipModule
} from '@nebular/theme';
import { BakeryCommonModule } from '@common';
import { BreadcrumbsComponent } from './actions/breadcrumbs/breadcrumbs.component';

import { OvenComponentName } from './actions/breadcrumbs/component-name.pipe';
import { DivideSpaceDialogDirective } from './actions/divide-space/divide-space-dialog.directive';
import { DivideSpaceLayoutListComponent } from './actions/divide-space/divide-space-layout-list.component';
import { DivideSpaceButtonComponent } from './actions/divide-space/divide-space-button.component';
import { BreadcrumbsHoverDirective } from './actions/breadcrumbs/breadcrumbs-hover.directive';
import { BreadcrumbsHoverComponent } from './breadcrumbs-hover/breadcrumbs-hover.component';
import { BreadcrumbsHoverService } from './breadcrumbs-hover/breadcrumbs-hover.service';
import { ComponentItemComponent } from './calculator/component-item.component';
import { ComponentListComponent } from './calculator/component-list.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { TagListComponent } from './calculator/tag-list.component';
import { ComponentSelectorComponent } from './component-selector/component-selector.component';
import { ActionsComponent } from './actions/actions.component';
import { ComponentSelectorService } from './component-selector/component-selector.service';
import { HoverHighlightService } from './hover-highlight/hover-highlight.service';
import { OvenOverlay } from './overlay';
import { OverlayService } from './overlay-adapter';
import { OvenOverlayContainer } from './overlay-container';
import { OverlayPositionBuilderService } from './overlay-position';
import { SelectHighlightService } from './select-highlight/select-highlight.service';
import { HoverHighlightComponent } from './hover-highlight/hover-highlight.component';
import { SelectHighlightComponent } from './select-highlight/select-highlight.component';
import { CalculatorPopoverComponent, CalculatorPopoverDirective } from './calculator/calculator-popover.component';
import { DropPlaceholderComponent } from './drag-drop/drop-placeholder.component';
import { WidgetItemComponent } from './calculator/widget-item.component';
import { WidgetListComponent } from './calculator/widget-list.component';
import { NoItemsComponent } from './calculator/no-items.component';
import { ResizeHandleComponent } from './resize/resize-handle/resize-handle.component';
import { SizeIndicatorComponent } from './resize/indicator/size-indicator.component';
import { SplitSpaceComponent } from './split-space/split-space.component';
import { StickIndicatorComponent } from './resize/indicator/stick-indicator.component';
import { MarginComponent } from './margin/margin.component';
import { PaddingComponent } from './padding/padding.component';
import { DataErrorComponent } from './actions/data-error.component';
import { DropContainerHighlightComponent } from './drag-drop/drop-container-highlight.component';

const COMPONENTS = [
  ComponentSelectorComponent,
  CalculatorComponent,
  ComponentListComponent,
  ComponentItemComponent,
  WidgetListComponent,
  WidgetItemComponent,
  TagListComponent,
  BreadcrumbsComponent,
  ActionsComponent,
  HoverHighlightComponent,
  SelectHighlightComponent,
  MarginComponent,
  PaddingComponent,
  DataErrorComponent,
  ResizeHandleComponent,
  CalculatorPopoverComponent,
  DropPlaceholderComponent,
  DropContainerHighlightComponent,
  DivideSpaceButtonComponent,
  DivideSpaceLayoutListComponent,
  NoItemsComponent,
  BreadcrumbsHoverComponent,
  SizeIndicatorComponent,
  StickIndicatorComponent,
  SplitSpaceComponent
];

const DIRECTIVES = [CalculatorPopoverDirective, DivideSpaceDialogDirective, BreadcrumbsHoverDirective];

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NbLayoutModule,
    NbInputModule,
    NbPopoverModule,
    NbTabsetModule,
    NbButtonModule,
    BakeryCommonModule,
    NbOverlayModule,
    NbTooltipModule,
    NbIconModule,
    NbTooltipModule
  ],
  declarations: [...COMPONENTS, ...DIRECTIVES, OvenComponentName],
  entryComponents: [...COMPONENTS],
  providers: [
    OvenOverlay,
    OverlayService,
    OvenOverlayContainer,
    OverlayPositionBuilderService,
    HoverHighlightService,
    ComponentSelectorService,
    SelectHighlightService,
    BreadcrumbsHoverService
  ]
})
export class DevUIModule {
}
