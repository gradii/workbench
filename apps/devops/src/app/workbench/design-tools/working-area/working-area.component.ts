import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BreakpointWidth, getBreakpointWidth } from '@common';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { environment } from '@devops-tools/devops/environments/environment';
import { getSelectedBreakpoint, getSelectedBreakpointRealWidth } from '@tools-state/breakpoint/breakpoint.selectors';
import { WorkingAreaFacade } from '@tools-state/working-area/working-area-facade.service';

import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { combineLatest, fromEvent, Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'len-working-area',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./working-area.component.scss'],
  template: ` 
    <iframe #iframe style="display:none"></iframe>
  `,
})
export class WorkingAreaComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('class') modeClass: string;
  @ViewChild('iframe', { read: ElementRef, static: true })
  private iframe: ElementRef;

  private destroyed$ = new Subject<void>();
  private window: Window;

  constructor(
    private sanitizer: DomSanitizer,
    private workingAreaFacade: WorkingAreaFacade,
    private elementRef: ElementRef,
  ) {
    this.window = window;
  }

  get workbenchUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.workbenchUrl
    );
  }

  ngOnInit(): void {
    this.listenIframe();
    this.listenMode();
    this.workingAreaFacade.attachActivePageNavigation();
  }

  ngAfterViewInit(): void {
    this.listenBreakpointChanges();

    const windowSize$: Observable<number> = fromEvent(
      this.window,
      'resize'
    ).pipe(
      map(() => this.elementRef.nativeElement.offsetWidth),
      startWith(this.elementRef.nativeElement.offsetWidth),
      tap((width: number) => this.workingAreaFacade.setIframeWidth(width))
    );

    const breakpointWidth$: Observable<Breakpoint> = getSelectedBreakpoint;

    combineLatest([windowSize$, breakpointWidth$])
      .pipe(
        map(([windowSize, breakpoint]: [number, Breakpoint]) => {
          if (breakpoint.width === BreakpointWidth.Desktop) {
            return windowSize;
          }

          return getBreakpointWidth(breakpoint.width) as number;
        }),
        tap((width: number) => this.workingAreaFacade.setIframeWidth(width)),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.workingAreaFacade.setIframe(null);
    this.workingAreaFacade.detachActivePageNavigation();
  }

  private listenIframe(): void {
    fromEvent(this.iframe.nativeElement, 'load')
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.workingAreaFacade.setIframe(
          this.iframe.nativeElement.contentWindow
        );
        this.workingAreaFacade.finishLoading();
      });
  }

  private listenMode(): void {
    this.workingAreaFacade.workingAreaMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mode: WorkingAreaMode) => (this.modeClass = mode));
  }

  private listenBreakpointChanges(): void {
    getSelectedBreakpointRealWidth
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (width: string) => (this.iframe.nativeElement.style.width = width)
      );
  }
}
