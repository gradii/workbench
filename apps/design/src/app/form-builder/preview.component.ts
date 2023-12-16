import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Subject } from 'rxjs';
import { skip, takeUntil, tap } from 'rxjs/operators';

import { BreakpointChangeSyncReason, BreakpointWidth, OvenApp } from '@common';
import { BakeryApp } from '@tools-state/app/app.model';
import { CommunicationService } from '@shared/communication/communication.service';
import { IframeProviderService } from '@shared/communication/iframe-provider.service';
import { environment } from '../../environments/environment';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { WindowBreakpointService } from '@core/breakpoint/window-breakpoint.service';

@Component({
  selector: 'ub-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./preview.component.scss'],
  template: ` <iframe #iframe [src]="workbenchUrl"></iframe> `
})
export class PreviewComponent implements OnInit, OnDestroy {
  @Output() loaded = new EventEmitter();
  @Output() error = new EventEmitter();

  private ovenApp: OvenApp;

  @Input() set app(app: BakeryApp) {
    this.ovenApp = this.stateConverter.convertState(app);
    this.renderApp(this.ovenApp);
  }

  workbenchUrl: SafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.workbenchUrl);
  @ViewChild('iframe', { read: ElementRef, static: true }) private iframe: ElementRef;
  private destroyed$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private iframeProvider: IframeProviderService,
    private communication: CommunicationService,
    private stateConverter: StateConverterService,
    private windowBreakpointService: WindowBreakpointService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.listenIframe();
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  private listenIframe() {
    fromEvent(this.iframe.nativeElement, 'load')
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.loaded.emit();
        this.iframeProvider.setIframeWindow(this.iframe.nativeElement.contentWindow);
        this.updateBreakpoint(this.ovenApp);
      });
  }

  private updateBreakpoint(app: OvenApp) {
    this.windowBreakpointService
      .breakpointChangesWithInitial(this.iframe.nativeElement.offsetWidth)
      .pipe(
        takeUntil(this.destroyed$),
        tap(({ width }) => this.sendBreakpoint(app, width)),
        skip(1)
      )
      .subscribe();
  }

  private sendBreakpoint(app, breakpoint: BreakpointWidth) {
    this.communication.setBreakpoint(breakpoint);
    this.communication.sendState(app, new BreakpointChangeSyncReason());
  }

  private renderApp(app: OvenApp) {
    this.communication.showDevUI(false);
    this.communication.sendState(app);
    this.communication.changeActivePage(app.pageList[0].url);
    this.cd.detectChanges();
  }
}
