import { Injectable } from '@angular/core';

import { ActionsService } from './actions/actions.service';
import { BreadcrumbsHoverService } from './breadcrumbs-hover/breadcrumbs-hover.service';
import { ChangeListenerService } from './change-listener/change-listener.service';
import { ClickSelectService } from './click-select/click-select.service';
import { ClipboardService } from './clipboard/clipboard.service';
import { ComponentSelectorService } from './component-selector/component-selector.service';
import { DevUIStateService } from './dev-ui-state.service';
import { HoverHighlightService } from './hover-highlight/hover-highlight.service';
import { MarginService } from './margin/margin.service';
import { PaddingService } from './padding/padding.service';
import { ResizeHandleFactory } from './resize/resize-handle-factory';
import { SelectHighlightService } from './select-highlight/select-highlight.service';
import { SplitSpaceService } from './split-space/split-space.service';

@Injectable(/*{ providedIn: 'root' }*/)
export class DevUIService {
  constructor(
    private actionsService: ActionsService,
    private componentSelectorService: ComponentSelectorService,
    private changeListenerService: ChangeListenerService,
    private clickSelectService: ClickSelectService,
    private hoverHighlight2Service: HoverHighlightService,
    private selectHighlightService: SelectHighlightService,
    private marginService: MarginService,
    private paddingService: PaddingService,
    // private dragDropService: DragDropService,
    private breadcrumbsHoverService: BreadcrumbsHoverService,
    private resizeService: ResizeHandleFactory,
    private splitService: SplitSpaceService,
    private clipboardService: ClipboardService,
    private devUIStateService: DevUIStateService
  ) {
  }

  init(): void {
    this.attachGlobalDevUI();
    this.attachComponentSpecificDevUI();
  }

  /**
   * These DevUI services attach global instances that don't need specific components.
   * */
  private attachGlobalDevUI(): void {
    this.breadcrumbsHoverService.attach();

    this.clickSelectService.attach(this.devUIStateService.flourElementsMap$);

    this.hoverHighlight2Service.attach(
      this.devUIStateService.selectedFlourComponents$,
      this.devUIStateService.flourElementsMap$,
      this.devUIStateService.attachedFlourComponents$
    );
    // this.dragDropService.attach(
    //   this.devUIStateService.selectedChanges$,
    //   this.devUIStateService.attachedComponents$,
    //   this.devUIStateService.elementsMap$
    // );
    this.clipboardService.attach(this.devUIStateService.attachedComponents$);
  }

  /**
   * These DevUI services handle selected components only
   * */
  private attachComponentSpecificDevUI() {
    // this.resizeService.attach();
    // this.splitService.attach();
    this.actionsService.attach();
    this.componentSelectorService.attach();
    this.selectHighlightService.attach();
    // this.changeListenerService.attach();
    // this.marginService.attach();
    // this.paddingService.attach();
  }
}
