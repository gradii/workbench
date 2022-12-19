import { ElementRef, Inject, Injectable, OnDestroy } from '@angular/core';
import { asyncScheduler, BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  takeUntil,
  tap,
  throttleTime,
  withLatestFrom
} from 'rxjs/operators';
import {
  ActiveBreakpointProvider,
  BreakpointWidth,
  KitchenUserNotifications,
  SpaceHeight,
  SpaceWidth,
  StylesCompilerService
} from '@common/public-api';
import { RenderState } from '../../state/render-state.service';

import { Rect, Rulers, VIRTUAL_COMPONENT } from './model';
import { RendererService } from '../../renderer/renderer.service';
import { ResizeStrategy } from './resize-strategy/resize-strategy';
import { getAsBoundingClientRect, getAsElementRef, getAsStyles } from '../util';
import { SizeIndicatorPainter } from './indicator/size-indicator-painter';
import { RulerPainter } from './ruler-painter';
import { FlourComponent } from '../../model';
import { SizeMapper } from './size-mapper';
import { StickIndicatorPainter } from './indicator/stick-indicator-painter';
import { reverseResize } from './util';
import { ResizeAltStickPainter } from './indicator/resize-alt-stick-painter';

@Injectable()
export class ResizeMediator implements OnDestroy {
  readonly hover = new BehaviorSubject<boolean>(false);
  private hover$ = this.hover.asObservable();

  private rect                            = new Subject<Rect>();
  public readonly rect$: Observable<Rect> = this.rect.asObservable();

  private resizing   = new BehaviorSubject<boolean>(false);
  readonly resizing$ = this.resizing.asObservable();

  private destroyed$ = new Subject<void>();
  private virtualComponent: FlourComponent;

  private reverseResize                               = new BehaviorSubject<boolean>(false);
  public readonly reverseResize$: Observable<boolean> = this.reverseResize.asObservable();

  constructor(
    private state: RenderState,
    private sizeIndicatorPainter: SizeIndicatorPainter,
    private stickIndicatorPainter: StickIndicatorPainter,
    private rulerPainter: RulerPainter,
    private renderer: RendererService,
    private sizeMapper: SizeMapper,
    private elementRef: ElementRef,
    private resizeStrategy: ResizeStrategy,
    @Inject(VIRTUAL_COMPONENT) virtualComponent,
    private activeBreakpointProvider: ActiveBreakpointProvider,
    private resizeAltStickPainter: ResizeAltStickPainter,
    private stylesCompiler: StylesCompilerService
  ) {
    this.virtualComponent = virtualComponent;
    this.reverseResize.next(reverseResize(this.virtualComponent));
    this.init();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.rulerPainter.clearPoints();
  }

  recalculateInitialValue() {
    const rect: Rect = this.parseSpaceRect();
    this.sizeIndicatorPainter.update(rect);
    this.stickIndicatorPainter.update(rect);
    this.resizeStrategy.setInitialRect(rect);
  }

  private init(): void {
    this.recalculateInitialValue();
    this.setupResizeStrategy();
    this.setupSizeIndicator();
    this.handleResizeAltStickNotification();
    this.sizeIndicatorPainter.init(this.elementRef, this.virtualComponent.rootType);
    this.stickIndicatorPainter.init(getAsElementRef(this.virtualComponent), this.virtualComponent.rootType);
    this.resizeAltStickPainter.init(this.elementRef, this.virtualComponent.rootType);
  }

  private setupSizeIndicator() {
    combineLatest([this.hover$, this.resizeStrategy.resizing$])
      .pipe(
        map(([hover, resizing]) => hover || resizing),
        distinctUntilChanged(),
        takeUntil(this.destroyed$)
      )
      .subscribe(draw => {
        if (draw) {
          this.sizeIndicatorPainter.show();
          this.stickIndicatorPainter.show();
        } else {
          this.sizeIndicatorPainter.hide();
          this.stickIndicatorPainter.hide();
        }
      });
  }

  private setupResizeStrategy() {
    this.resizeStrategy.resizing$.pipe(takeUntil(this.destroyed$)).subscribe((resizing: boolean) => {
      this.resizing.next(resizing);
      this.state.highlightEnabled$.next(!resizing);
    });

    this.resizeStrategy.commitResize$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(({ stickMode }) => this.commitResize(stickMode));

    this.resizeStrategy.rect$
      .pipe(
        tap((rect: Rect) => {
          this.sizeIndicatorPainter.update(rect);
          this.stickIndicatorPainter.update(rect);
          this.resizeAltStickPainter.update();
          this.rect.next(rect);
        }),
        throttleTime(200, asyncScheduler, { trailing: true }),
        takeUntil(this.destroyed$)
      )
      .subscribe((rect: Rect) => {
        this.resize(rect);
      });

    this.resizeStrategy.rulers$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((rulers: Rulers) => this.rulerPainter.redrawRulers(rulers));

    this.resizeStrategy.reverseResize$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((reverse: boolean) => this.reverseResize.next(reverse));
  }

  private resize(rect: Rect) {
    const { width: w, height: h } = this.stylesCompiler.compileStyles(getAsStyles(this.virtualComponent));
    const width: SpaceWidth       = rect.dimension === 'vertical' ? w : this.sizeMapper.createSpaceWidth(rect.width);
    const height: SpaceHeight     = rect.dimension === 'horizontal' ? h : this.sizeMapper.createSpaceHeight(
      rect.height);
    this.state.resize(this.virtualComponent, width, height);
    this.rebindView(width, height);
  }

  private rebindView(width: SpaceWidth, height: SpaceHeight) {
    const { view, component }               = this.virtualComponent;
    const activeBreakpoint: BreakpointWidth = this.activeBreakpointProvider.getActiveBreakpoint();
    const reboundComponent                  = {
      ...component,
      styles: {
        ...component.styles,
        [activeBreakpoint]: {
          ...component.styles[activeBreakpoint],
          width,
          height
        }
      }
    };
    this.renderer.performBinding(view, reboundComponent);
  }

  private commitResize(stickMode: boolean) {
    this.state.commitResize(stickMode);
  }

  private parseSpaceRect(): Rect {
    const rect: ClientRect    = getAsBoundingClientRect(this.virtualComponent);
    const styles              = this.stylesCompiler.compileStyles(this.virtualComponent.component.styles);
    const width: SpaceWidth   = styles.width;
    const height: SpaceHeight = styles.height;

    return {
      width : this.sizeMapper.parseSpaceWidth(width, rect),
      height: this.sizeMapper.parseSpaceHeight(height, rect)
    };
  }

  private handleResizeAltStickNotification(): void {
    const HIDE_DELAY = 3000;

    const resizing$    = this.resizeStrategy.resizing$;
    const notResizing$ = resizing$.pipe(filter((resizing: boolean) => !resizing));

    const showAltStick$ = resizing$.pipe(
      withLatestFrom(this.state.userNotifications$),
      filter(([resizing]) => resizing),
      map(([_resizing, userNotifications]: [boolean, KitchenUserNotifications]) => {
        return userNotifications && userNotifications.viewedResizeAltStick;
      }),
      filter((viewedResizeAltStick: boolean) => !viewedResizeAltStick),
      mapTo(true),
      takeUntil(this.destroyed$)
    );

    const hideAltStick$ = merge(notResizing$, showAltStick$.pipe(delay(HIDE_DELAY))).pipe(mapTo(false));

    merge(showAltStick$, hideAltStick$).subscribe((show: boolean) => {
      if (show) {
        this.resizeAltStickPainter.show();
        this.state.incViewedResizeAltStick();
      } else {
        this.resizeAltStickPainter.hide();
      }
    });
  }
}
