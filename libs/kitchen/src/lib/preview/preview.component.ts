import { OverlayContainer } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output
} from '@angular/core';
import {
  ActiveSetting, BreakpointWidth, KitchenSettings, KitchenUserNotifications, LocalStorageItem, MessageAction, SyncMsg
} from '@common/public-api';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { DevUIService } from '../dev-ui';
import { PainterService } from '../renderer/painter.service';

import { KitchenState } from '../state/kitchen-state.service';

// import '../styles/dev-ui-styles.scss';
// import '../styles/workbench-styles.scss';
import { GlobalStateService } from '../workflow/global-state.service';
import { CustomCodeService } from './custom-code.service';
import { RouterFeedbackService } from './router-feedback.service';
import { RouterService } from './router.service';

/**
 * PreviewComponent is an entry point of the Kitchen library.
 * All entire application will be rendered inside it.
 * */
@Component({
  selector       : 'kitchen-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./preview.component.scss'],
  template       : `
    <div cdkScrollable
         style="position: relative; height: calc(100vh - 52px); overflow: auto;">
      <puff-definitions></puff-definitions>
      <kitchen-layout></kitchen-layout>
    </div>
  `
})
export class PreviewComponent implements OnInit, OnDestroy {
  @Input()
  set state(syncMsg: SyncMsg) {
    if (syncMsg) {
      const routerConfig = this.routerService.registerPages(syncMsg.state);
      this.kitchenState.sync(syncMsg);
    }
  }

  @Input()
  set selectedComponents(selected: string[]) {
    if (selected) {
      this.kitchenState.setActiveComponentIdList(selected);
    }
  }

  @Input()
  set hoveredComponent(selected: string) {
    this.kitchenState.setHoveredComponent(selected);
  }

  @Input()
  set settings(settings: KitchenSettings) {
    this.kitchenState.setSettings(settings);
  }

  @Input()
  set showDevUI(show: boolean) {
    if (show !== null) {
      this.kitchenState.setShowDevUI(show);
    }
  }

  @Input()
  set privileges(privileges: string[]) {
    if (privileges) {
      this.kitchenState.setPrivileges(privileges);
    }
  }

  @Input()
  set breakpoint(breakpoint: BreakpointWidth) {
    if (breakpoint) {
      this.kitchenState.setActiveBreakpoint(breakpoint);
    }
  }

  @Input()
  set activeSetting(activeSetting: ActiveSetting) {
    this.kitchenState.setActiveSetting(activeSetting);
  }

  @Input()
  set userNotifications(userNotifications: KitchenUserNotifications) {
    this.kitchenState.setUserNotifications(userNotifications);
  }

  @Input()
  set localStorageItems(items: LocalStorageItem[]) {
    this.globalState.setLocalStorageItems(items || []);
  }

  @Output() message = new EventEmitter<{ type: MessageAction; payload: any }>();
  @Output() ready   = this.kitchenState.syncMsg$.pipe(take(1));

  private destroyed = new Subject<void>();

  constructor(
    private elementRef: ElementRef,
    private painterService: PainterService,
    private routerService: RouterService,
    private devUIService: DevUIService,
    private globalState: GlobalStateService,
    private kitchenState: KitchenState,
    private routerFeedbackService: RouterFeedbackService,
    private customCodeService: CustomCodeService,
    private overlayContainer: OverlayContainer,
    private _ngZone: NgZone
  ) {
  }

  // onContentChange(event) {
  //   this.applyOverlayContainerClipPath();
  // }
  //
  // applyOverlayContainerClipPath() {
  //   const element = this.overlayContainer.getContainerElement();
  //
  //   const { right, top, bottom } = this.elementRef.nativeElement.getBoundingClientRect();
  //
  //   const left = 0;
  //
  //   element.style.clipPath = `polygon(${left}px ${top}px, ${right}px ${top}px, ${right}px 100%, ${left}px 100%)`;
  // }

  ngOnInit(): void {
    this.routerFeedbackService.handleRouting();
    this.devUIService.init();
    this.painterService.attach();
    this.customCodeService.attach();

    // this.kitchenState.setPreviewContainerElement(this.elementRef.nativeElement);


    this.kitchenState.message$
      .pipe(takeUntil(this.destroyed))
      .subscribe((data: { type: MessageAction; payload: any }) => this.message.emit(data));

    const element = this.overlayContainer.getContainerElement();

    // this.applyOverlayContainerClipPath();
    this.elementRef.nativeElement.append(element);
  }

  ngOnDestroy() {
    this.painterService.detach();
    this.customCodeService.detach();
    this.destroyed.next();
  }
}
