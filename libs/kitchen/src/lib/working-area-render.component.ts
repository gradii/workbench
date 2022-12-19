import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActiveSetting, BreakpointWidth, DEFAULT_SETTINGS, FeatureHiderService, getModelVersion, LocalStorageItem,
  MessageAction, KitchenApp, KitchenSettings, KitchenUserNotifications, SentryInfo
} from '@common/public-api';
import { environment } from '@environments';
import * as Sentry from '@sentry/browser';
import { BackspaceService } from '@workbench-core/backspace.service';
import { CommunicationService } from '@workbench-core/communication/communication.service';
import { ShortcutService } from '@workbench-core/shortcut.service';
import { ThumbnailService } from '@workbench-core/thumbnail.service';
import { Observable, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'len-working-area-render',
  // encapsulation: ViewEncapsulation.ShadowDom,
  template: `
    <kitchen-preview
      [state]="state$ | async"
      [selectedComponents]="selectedComponents$ | async"
      [hoveredComponent]="hoveredComponent$ | async"
      [settings]="settings$ | async"
      [userNotifications]="userNotifications$ | async"
      [showDevUI]="showDevUI$ | async"
      [privileges]="privileges$ | async"
      [breakpoint]="breakpoint$ | async"
      [activeSetting]="activeSetting$ | async"
      [localStorageItems]="localStorageItems$ | async"
      (message)="sendMessage($event)"
      (ready)="ready()"
    >
    </kitchen-preview>
  `,
})
export class WorkingAreaRenderComponent {
  state$: Observable<KitchenApp> = this.communication.state$;
  selectedComponents$: Observable<string[]> =
    this.communication.selectedComponents$;
  hoveredComponent$: Observable<string> = this.communication.hoveredComponent$;
  showDevUI$: Observable<boolean> = this.communication.showDevUI$;
  privileges$: Observable<string[]> = this.communication.privileges$;
  breakpoint$: Observable<BreakpointWidth> = this.communication.breakpoint$;
  activeSetting$: Observable<ActiveSetting> = this.communication.activeSetting$;
  settings$: Observable<KitchenSettings> = this.communication.settings$.pipe(
    startWith(DEFAULT_SETTINGS)
  );
  userNotifications$: Observable<KitchenUserNotifications> =
    this.communication.userNotifications$;
  localStorageItems$: Observable<LocalStorageItem[]> =
    this.communication.localStorageItems$;

  private destroyed = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private communication: CommunicationService,
    private backspaceService: BackspaceService,
    private shortcutService: ShortcutService,
    private thumbnailService: ThumbnailService,
    private featureHider: FeatureHiderService
  ) {}

  ngOnInit() {
    this.sendVersion();
    this.attachKeyboardServices();
    this.detachKeyboardInPreview();
    this.thumbnailService.attach();
    // this.communication.activePageUrl$
    //   .pipe(takeUntil(this.destroyed), delay(100))
    //   .subscribe((url: string) => this.router.navigateByUrl(url));

    this.subscribeOnSentryInfo();
    this.featureHider.init();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.thumbnailService.detach();
    this.detachKeyboardServices();
  }

  sendMessage(data: { type: MessageAction; payload: any }) {
    this.communication.sendMessageWithPayload(data.type, data.payload);
  }

  ready() {
    this.communication.sendMessage(MessageAction.READY);
  }

  private attachKeyboardServices() {
    this.shortcutService.attach();
    this.backspaceService.attach();
  }

  private detachKeyboardServices() {
    this.shortcutService.detach();
    this.backspaceService.detach();
  }

  private detachKeyboardInPreview() {
    this.showDevUI$
      .pipe(takeUntil(this.destroyed))
      .subscribe((show: boolean) => {
        if (show) {
          this.attachKeyboardServices();
        } else {
          this.detachKeyboardServices();
        }
      });
  }

  private subscribeOnSentryInfo() {
    if (environment.production) {
      this.communication.sentryInfo$
        .pipe(takeUntil(this.destroyed))
        .subscribe((sentryInfo: SentryInfo) => Sentry.setUser(sentryInfo));
    }
  }

  private sendVersion() {
    this.communication.sendMessageWithPayload(
      MessageAction.WORKBENCH_MODEL_VERSION,
      getModelVersion()
    );
  }
}
