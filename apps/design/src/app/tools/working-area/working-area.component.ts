import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { combineLatest, fromEvent, Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { WorkingAreaFacade } from '@tools-state/working-area/working-area-facade.service';
import { environment } from '../../../environments/environment';
import { fromTools } from '@tools-state/tools.reducer';
import { getSelectedBreakpoint, getSelectedBreakpointRealWidth } from '@tools-state/breakpoint/breakpoint.selectors';
import { NB_WINDOW } from '@nebular/theme';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { BreakpointWidth, getBreakpointWidth } from '@common';

@Component({
  selector: 'ub-working-area',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./working-area.component.scss'],
  template: '<iframe #iframe [src]="workbenchUrl"></iframe>'
})
export class WorkingAreaComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('class') modeClass: string;
  @ViewChild('iframe', { read: ElementRef, static: true }) private iframe: ElementRef;

  private destroyed$ = new Subject<void>();
  private window: Window;

  constructor(
    private sanitizer: DomSanitizer,
    private store: Store<fromTools.State>,
    private workingAreaFacade: WorkingAreaFacade,
    private elementRef: ElementRef,
    @Inject(NB_WINDOW) window
  ) {
    this.window = window;
  }

  get workbenchUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(environment.workbenchUrl);
  }

  ngOnInit(): void {
    this.listenIframe();
    this.listenMode();
    this.workingAreaFacade.attachActivePageNavigation();
  }

  ngAfterViewInit(): void {
    this.listenBreakpointChanges();

    const windowSize$: Observable<number> = fromEvent(this.window, 'resize').pipe(
      map(() => this.elementRef.nativeElement.offsetWidth),
      startWith(this.elementRef.nativeElement.offsetWidth),
      tap((width: number) => this.workingAreaFacade.setIframeWidth(width))
    );

    const breakpointWidth$: Observable<Breakpoint> = this.store.pipe(select(getSelectedBreakpoint));

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
        this.workingAreaFacade.setIframe(this.iframe.nativeElement.contentWindow);
        this.workingAreaFacade.finishLoading();
      });
  }

  private listenMode(): void {
    this.workingAreaFacade.workingAreaMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mode: WorkingAreaMode) => (this.modeClass = mode));
  }

  private listenBreakpointChanges(): void {
    this.store
      .pipe(select(getSelectedBreakpointRealWidth), takeUntil(this.destroyed$))
      .subscribe((width: string) => (this.iframe.nativeElement.style.width = width));
  }
}
