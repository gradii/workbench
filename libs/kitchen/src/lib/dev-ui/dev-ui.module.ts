import { OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BakeryCommonModule } from '@common/public-api';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriInputModule } from '@gradii/triangle/input';
import { TriPopoverModule } from '@gradii/triangle/popover';
import { TriTabsModule } from '@gradii/triangle/tabs';
import { TriTooltipModule } from '@gradii/triangle/tooltip';
import { KitchenState } from '../state/kitchen-state.service';
import { RenderState } from '../state/render-state.service';
import { UIActionIntentService } from '../state/ui-action-intent.service';
import { ComponentHelper } from '../util/component.helper';
import { LayoutHelper } from '../util/layout-helper.service';
import { ActionsComponent } from './actions/actions.component';
import { ActionsService } from './actions/actions.service';
import { BreadcrumbsHoverDirective } from './actions/breadcrumbs/breadcrumbs-hover.directive';
import { BreadcrumbsComponent } from './actions/breadcrumbs/breadcrumbs.component';

import { KitchenComponentName } from './actions/breadcrumbs/component-name.pipe';
import { DataErrorComponent } from './actions/data-error.component';
import { DivideSpaceButtonComponent } from './actions/divide-space/divide-space-button.component';
import { DivideSpaceDialogDirective } from './actions/divide-space/divide-space-dialog.directive';
import { DivideSpaceLayoutListComponent } from './actions/divide-space/divide-space-layout-list.component';
import { BreadcrumbsHoverComponent } from './breadcrumbs-hover/breadcrumbs-hover.component';
import { BreadcrumbsHoverService } from './breadcrumbs-hover/breadcrumbs-hover.service';
import { CalculatorComponent } from './calculator/calculator.component';
import { ComponentItemComponent } from './calculator/component-item.component';
import { ComponentListComponent } from './calculator/component-list.component';
import { NoItemsComponent } from './calculator/no-items.component';
import { TagListComponent } from './calculator/tag-list.component';
import { WidgetItemComponent } from './calculator/widget-item.component';
import { WidgetListComponent } from './calculator/widget-list.component';
import { ChangeListenerService } from './change-listener/change-listener.service';
import { ClickSelectService } from './click-select/click-select.service';
import { ClipboardService } from './clipboard/clipboard.service';
import { ComponentSelectorComponent } from './component-selector/component-selector.component';
import { ComponentSelectorService } from './component-selector/component-selector.service';
import { ComponentSpecificDevUI } from './component-specific-dev-ui';
import { DevUIStateService } from './dev-ui-state.service';
import { DevUIService } from './dev-ui.service';
import { DOMElementsService } from './dom-elements.service';
import { DragDropService } from './drag-drop/drag-drop.service';
import { DropContainerHighlightRendererFactoryService } from './drag-drop/drop-container-highlight';
import { DropContainerHighlightComponent } from './drag-drop/drop-container-highlight.component';
import { DropPlaceholderRendererFactoryService } from './drag-drop/drop-placeholder-renderer.service';
import { DropPlaceholderComponent } from './drag-drop/drop-placeholder.component';
import { DropPositionCalculator } from './drag-drop/highlight-drop-position-command';
import { HoverHighlightContext } from './hover-highlight/hover-highlight-context';
import { HoverHighlightComponent } from './hover-highlight/hover-highlight.component';
import { HoverHighlightService } from './hover-highlight/hover-highlight.service';
import { MarginComponent } from './margin/margin.component';
import { MarginService } from './margin/margin.service';
import { KitchenOverlay } from './overlay';
import { Kitchen2OverlayContainer, KitchenOverlayContainer } from './overlay-container';
import { OverlayPositionBuilderService } from './overlay-position';
import { PaddingComponent } from './padding/padding.component';
import { PaddingService } from './padding/padding.service';
import { ResizeAltStickPainter } from './resize/indicator/resize-alt-stick-painter';
import { SizeIndicatorPainter } from './resize/indicator/size-indicator-painter';
import { SizeIndicatorComponent } from './resize/indicator/size-indicator.component';
import { StickIndicatorPainter } from './resize/indicator/stick-indicator-painter';
import { StickIndicatorComponent } from './resize/indicator/stick-indicator.component';
import { ResizeHandleFactory } from './resize/resize-handle-factory';
import { ResizeHandleComponent } from './resize/resize-handle/resize-handle.component';
import { RulerPainter } from './resize/ruler-painter';
import { SelectHighlightComponent } from './select-highlight/select-highlight.component';
import { SelectHighlightService } from './select-highlight/select-highlight.service';
import { SplitSpaceComponent } from './split-space/split-space.component';
import { SplitSpaceService } from './split-space/split-space.service';

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
  // CalculatorPopoverComponent,
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

const DIRECTIVES = [
  /*CalculatorPopoverDirective,*/
  DivideSpaceDialogDirective,
  BreadcrumbsHoverDirective
];

@NgModule({
  imports     : [
    FormsModule,
    CommonModule,
    BakeryCommonModule,

    TriIconModule,
    TriPopoverModule,
    TriButtonModule,
    TriTooltipModule,
    TriTabsModule,
    TriInputModule,
  ],
  declarations: [...COMPONENTS, ...DIRECTIVES, KitchenComponentName],
  providers   : [
    KitchenOverlay,
    KitchenOverlayContainer,
    OverlayPositionBuilderService,

    DevUIService,

    ActionsService,
    HoverHighlightService,
    ComponentSelectorService,
    SelectHighlightService,
    BreadcrumbsHoverService,

    RenderState,
    KitchenState,
    ComponentSpecificDevUI,
    DevUIStateService,
    LayoutHelper,
    ChangeListenerService,
    ClickSelectService,
    MarginService,
    PaddingService,
    ResizeHandleFactory,
    SplitSpaceService,
    ClipboardService,
    ComponentHelper,
    UIActionIntentService,
    DOMElementsService,
    ResizeAltStickPainter,
    SizeIndicatorPainter,
    StickIndicatorPainter,
    RulerPainter,
    DragDropService,
    DropContainerHighlightRendererFactoryService,
    DropPlaceholderRendererFactoryService,
    DropPositionCalculator,
    HoverHighlightContext,
    SelectHighlightService,

    { provide: OverlayContainer, useClass: Kitchen2OverlayContainer }
  ],
  exports     : []
})
export class DevUIModule {
}
