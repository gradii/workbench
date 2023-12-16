import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnalyticsService } from '@common';

import { LoaderService } from '@core/loader.service';
import { NB_WINDOW } from '@nebular/theme';
import { WindowBreakpointService } from '@core/breakpoint/window-breakpoint.service';
import { ChatService } from '@core/chat.service';

@Component({
  selector: 'ub-share',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ub-preview *ngIf="!(error$ | async)" (loaded)="hideLoader()" (error)="error$.next(true)"></ub-preview>
    <ub-not-found *ngIf="error$ | async"></ub-not-found>
  `
})
export class ShareComponent implements OnInit {
  error$ = new BehaviorSubject<boolean>(false);
  private window: Window;

  constructor(
    private loaderService: LoaderService,
    private analytics: AnalyticsService,
    private windowBreakpointService: WindowBreakpointService,
    private chatService: ChatService,
    @Inject(NB_WINDOW) window
  ) {
    this.window = window;
    this.chatService.hide();
  }

  ngOnInit(): void {
    const breakpoint = this.windowBreakpointService.convertWidthToBreakpoint(this.window.innerWidth);
    this.analytics.logViewShareProject(breakpoint.width);
  }

  hideLoader() {
    this.loaderService.hide();
  }
}
