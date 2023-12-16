import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, fromEvent, Subject } from 'rxjs';
import { map, mergeMap, skip, takeUntil, tap } from 'rxjs/operators';
import { AnalyticsService, BreakpointChangeSyncReason, BreakpointWidth, OvenApp } from '@common';

import { CommunicationService } from '@shared/communication/communication.service';
import { IframeProviderService } from '@shared/communication/iframe-provider.service';
import { environment } from '../../environments/environment';
import { ShareApiService } from './share-api.service';
import { WindowBreakpointService } from '@core/breakpoint/window-breakpoint.service';

@Component({
  selector: 'ub-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./preview.component.scss'],
  template: `
    <a [href]="landingPath" target="_blank">
      <img *ngIf="madeInSrc" class="madeIn" [src]="madeInSrc" />
    </a>
    <iframe #iframe [src]="workbenchUrl"></iframe>
  `
})
export class PreviewComponent implements OnInit, OnDestroy {
  @Output() loaded = new EventEmitter();
  @Output() error = new EventEmitter();

  madeInSrc: string;
  workbenchUrl: SafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.workbenchUrl);
  landingPath: SafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.landingPath + '?utm_campaign=share');
  @ViewChild('iframe', { read: ElementRef, static: true }) private iframe: ElementRef;
  private destroyed$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private iframeProvider: IframeProviderService,
    private communication: CommunicationService,
    private cd: ChangeDetectorRef,
    private windowBreakpointService: WindowBreakpointService,
    private shareApi: ShareApiService,
    private analytics: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.listenIframe();
    this.initializeProject();
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  private listenIframe() {
    fromEvent(this.iframe.nativeElement, 'load')
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.iframeProvider.setIframeWindow(this.iframe.nativeElement.contentWindow);
      });
  }

  private updateBreakpoint(app: OvenApp) {
    this.windowBreakpointService
      .breakpointChangesWithInitial(this.iframe.nativeElement.offsetWidth)
      .pipe(
        takeUntil(this.destroyed$),
        tap(({ width }) => this.sendBreakpoint(app, width)),

        // Skip the first event since we don't need it in analytics
        skip(1)
      )
      .subscribe(({ width }) => {
        this.analytics.logChangeBreakpoint(width, 'sharing', 'browserResize');
      });
  }

  private initializeProject() {
    combineLatest([
      this.route.paramMap.pipe(
        map((params: ParamMap) => params.get('shareId')),
        mergeMap((shareId: string) => this.shareApi.getProject(shareId)),
        tap((app: OvenApp) => this.renderApp(app))
      ),
      fromEvent(this.iframe.nativeElement, 'load')
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        ([app]: [OvenApp, Event]) => {
          this.updateBreakpoint(app);
          this.loaded.emit();
          this.updateMadeIn(app);
        },
        () => {
          this.error.emit();
          this.cd.detectChanges();
        }
      );
  }

  private sendBreakpoint(app, breakpoint: BreakpointWidth) {
    this.communication.setBreakpoint(breakpoint);
    this.communication.sendState(app, new BreakpointChangeSyncReason());
  }

  private renderApp(app: OvenApp) {
    this.communication.showDevUI(false);
    this.communication.sendState(app);
    this.communication.changeActivePage(app.pageList[0].url);
  }

  private updateMadeIn(app: OvenApp) {
    this.madeInSrc = `assets/made_in_${app.theme.dark ? 'dark' : 'light'}.svg`;
    this.cd.detectChanges();
  }
}
