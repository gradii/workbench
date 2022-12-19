import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CommitResizeKitchenSpace } from '@common/public-api';

import { RenderState } from '../../../state/render-state.service';
import { noopRulers, Rect, ResizeContext, Rulers, VIRTUAL_COMPONENT } from '../model';
import { Resizer } from './resizer';
import { ResizeContextResolver } from './resize-context-resolver';
import { FlourComponent } from '../../../model';
import { reverseResize } from '../util';
import { MousedownProvider, ResizeDimension } from './mousedown-provider';

/**
 * Listens for UI events and decides whether we need to do the resize of the space
 * */
@Injectable()
export class ResizeStrategy implements OnDestroy {
  private rect                            = new Subject<Rect>();
  public readonly rect$: Observable<Rect> = this.rect.asObservable();

  private resizing          = new BehaviorSubject<boolean>(false);
  public readonly resizing$ = this.resizing.asObservable();

  private commitResize                                                = new Subject<CommitResizeKitchenSpace>();
  public readonly commitResize$: Observable<CommitResizeKitchenSpace> = this.commitResize.asObservable();

  private rulers                              = new BehaviorSubject<Rulers>(noopRulers());
  public readonly rulers$: Observable<Rulers> = this.rulers.asObservable();

  private vc: FlourComponent;

  private reverseResize                               = new BehaviorSubject<boolean>(false);
  public readonly reverseResize$: Observable<boolean> = this.reverseResize.asObservable();

  private destroyed$ = new Subject<void>();
  private window: Window;

  constructor(
    @Inject(VIRTUAL_COMPONENT) virtualComponent,
    private contextResolver: ResizeContextResolver,
    private resizer: Resizer,
    private state: RenderState,
    private mousedownProvider: MousedownProvider
  ) {
    this.window = window;
    this.vc     = virtualComponent;
    this.reverseResize.next(reverseResize(this.vc));
    this.subscribeOnDrag();

    this.resizer.rulers$.pipe(takeUntil(this.destroyed$)).subscribe(rulers => this.rulers.next(rulers));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  setInitialRect(rect: Rect): void {
    this.resizer.setInitialRect(rect);
  }

  private subscribeOnDrag() {
    this.createStartResizeStream()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((rect: Rect) => this.rect.next(rect));
  }

  private createStartResizeStream(): Observable<Rect> {
    return this.mousedownProvider.mousedown$.pipe(
      switchMap(({ e, dimension }) => {
        this.enableXray();
        this.resizing.next(true);
        const ctx: ResizeContext = this.contextResolver.resolveContext(e);
        const stopResize$        = this.createStopResizeStream(ctx, dimension);
        return this.createResizeStream(ctx, dimension).pipe(takeUntil(merge(this.destroyed$, stopResize$)));
      })
    );
  }

  private createResizeStream(ctx: ResizeContext, dimension: ResizeDimension): Observable<Rect> {
    const mousemove$  = fromEvent(this.window, 'mousemove');
    const mouseleave$ = fromEvent(this.window, 'mouseleave');
    return merge(mousemove$, mouseleave$).pipe(
      distinctUntilChanged((a: MouseEvent, b: MouseEvent) => this.compareEvents(a, b)),
      switchMap((e: MouseEvent) => this.resizer.resize(e, ctx, dimension)),
      tap(() => this.reverseResize.next(reverseResize(this.vc)))
    );
  }

  private createStopResizeStream(ctx: ResizeContext, dimension: ResizeDimension): Observable<Event> {
    return fromEvent(this.window, 'mouseup').pipe(
      switchMap((e: MouseEvent) => {
        this.reverseResize.next(reverseResize(this.vc));
        return this.resizer.resize(e, ctx, dimension).pipe(
          tap(rect => {
            this.rect.next(rect);
            this.endResize(e.altKey);
          })
        );
      }),
      map(() => null),
      takeUntil(this.destroyed$)
    );
  }

  private endResize(altKey: boolean) {
    this.resizing.next(false);
    this.commitResize.next({ stickMode: altKey });
    this.rulers.next(noopRulers());
    this.disableXray();
    this.resizer.endResize();
    this.state.highlightComponentPaddings('');
  }

  private compareEvents(a: MouseEvent, b: MouseEvent): boolean {
    return a.pageX === b.pageX && a.pageY === b.pageY;
  }

  private enableXray(): void {
    // Enables partial xray on sibling elements only
    this.vc.parentComponent.view.element.nativeElement.classList.add('partial-x-ray');
  }

  private disableXray(): void {
    // Disables partial xray on sibling elements only
    this.vc.parentComponent.view.element.nativeElement.classList.remove('partial-x-ray');
  }
}
