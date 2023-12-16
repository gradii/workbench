import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
  ActiveSetting,
  BreakpointWidth,
  MessageAction,
  OvenSettings,
  OvenUserNotifications,
  SyncMsg,
  LocalStorageItem
} from '@common';

import 'style-loader!../styles/dev-ui-styles.scss';
import 'style-loader!../styles/workbench-styles.scss';
import { DevUIService } from '../dev-ui';
import { PainterService } from '../renderer/painter.service';
import { RouterService } from './router.service';

import { OvenState } from '../state/oven-state.service';
import { RouterFeedbackService } from './router-feedback.service';
import { GlobalStateService } from '../workflow/global-state.service';
import { CustomCodeService } from './custom-code.service';

/**
 * PreviewComponent is an entry point of the Oven library.
 * All entire application will be rendered inside it.
 * */
@Component({
  selector: 'oven-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./preview.component.scss'],
  template: `
    <oven-definitions></oven-definitions>
    <oven-layout></oven-layout>
  `
})
export class PreviewComponent implements OnInit, OnDestroy {
  @Input() set state(syncMsg: SyncMsg) {
    if (syncMsg) {
      this.routerService.registerPages(syncMsg.state);
      this.ovenState.sync(syncMsg);
    }
  }

  @Input() set selectedComponents(selected: string[]) {
    if (selected) {
      this.ovenState.setActiveComponentIdList(selected);
    }
  }

  @Input() set hoveredComponent(selected: string) {
    this.ovenState.setHoveredComponent(selected);
  }

  @Input() set settings(settings: OvenSettings) {
    this.ovenState.setSettings(settings);
  }

  @Input() set showDevUI(show: boolean) {
    if (show !== null) {
      this.ovenState.setShowDevUI(show);
    }
  }

  @Input() set privileges(privileges: string[]) {
    if (privileges) {
      this.ovenState.setPrivileges(privileges);
    }
  }

  @Input() set breakpoint(breakpoint: BreakpointWidth) {
    if (breakpoint) {
      this.ovenState.setActiveBreakpoint(breakpoint);
    }
  }

  @Input() set activeSetting(activeSetting: ActiveSetting) {
    this.ovenState.setActiveSetting(activeSetting);
  }

  @Input() set userNotifications(userNotifications: OvenUserNotifications) {
    this.ovenState.setUserNotifications(userNotifications);
  }

  @Input() set localStorageItems(items: LocalStorageItem[]) {
    this.globalState.setLocalStorageItems(items || []);
  }

  @Output() message = new EventEmitter<{ type: MessageAction; payload: any }>();
  @Output() ready = this.ovenState.syncMsg$.pipe(take(1));

  private destroyed = new Subject<void>();

  constructor(
    private painterService: PainterService,
    private routerService: RouterService,
    private devUIService: DevUIService,
    private globalState: GlobalStateService,
    private ovenState: OvenState,
    private routerFeedbackService: RouterFeedbackService,
    private customCodeService: CustomCodeService
  ) {
  }

  ngOnInit(): void {
    this.routerFeedbackService.handleRouting();
    this.devUIService.init();
    this.painterService.attach();
    this.customCodeService.attach();

    this.ovenState.message$
      .pipe(takeUntil(this.destroyed))
      .subscribe((data: { type: MessageAction; payload: any }) => this.message.emit(data));
  }

  ngOnDestroy() {
    this.painterService.detach();
    this.customCodeService.detach();
    this.destroyed.next();
  }
}
