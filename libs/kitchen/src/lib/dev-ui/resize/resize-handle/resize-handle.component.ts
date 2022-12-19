import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostBinding, HostListener, Inject, Input, OnDestroy,
  OnInit, ViewChild, ɵdetectChanges
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlourComponent } from '../../../model';
import { HoverHighlightContext } from '../../hover-highlight/hover-highlight-context';
import { VIRTUAL_COMPONENT } from '../model';

import { ResizeMediator } from '../resize-mediator';
import { MousedownProvider } from '../resize-strategy/mousedown-provider';
import { providers } from './providers';

@Component({
  selector       : 'kitchen-resize-handle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./resize-handle.component.scss'],
  template       : `
    <div #vertical class="vertical-handle">
      <div class="handle"></div>
    </div>
    <div #horizontal [class.reverse]="reverseResize$ | async" class="horizontal-handle">
      <div class="handle"></div>
    </div>
    <div #both [class.reverse]="reverseResize$ | async" class="both-handle">
      <div class="handle"></div>
    </div>
  `,
  providers      : [...providers]
})
export class ResizeHandleComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('style.width')
  @Input()
  width: string;

  @HostBinding('style.height')
  @Input()
  height: string;

  @ViewChild('both', { read: ElementRef }) bothHandle: ElementRef;
  @ViewChild('vertical', { read: ElementRef }) verticalHandle: ElementRef;
  @ViewChild('horizontal', { read: ElementRef }) horizontalHandle: ElementRef;

  readonly reverseResize$: Observable<boolean> = this.resizeMediator.reverseResize$;

  private resizing   = false;
  private destroyed$ = new Subject<void>();
  private virtualComponent: FlourComponent;

  constructor(
    private resizeMediator: ResizeMediator,
    private mousedownProvider: MousedownProvider,
    private hoverHighlightContext: HoverHighlightContext,
    @Inject(VIRTUAL_COMPONENT) virtualComponent
  ) {
    this.virtualComponent = virtualComponent;
  }

  @HostBinding('class.active') get active(): boolean {
    return this.resizing;
  }

  @HostListener('mouseenter') mouseenter() {
    this.resizeMediator.hover.next(true);
  }

  @HostListener('mouseleave') mouseleave() {
    this.resizeMediator.hover.next(false);
  }

  ngOnInit(): void {
    this.resizeMediator.resizing$.pipe(takeUntil(this.destroyed$)).subscribe((resizing: boolean) => {
      this.resizing = resizing;
      this.hoverHighlightContext.setDisabled(resizing);
    });

    this.resizeMediator.rect$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      // TODO
      const { width, height } = this.virtualComponent.view.element.nativeElement.getBoundingClientRect();
      this.width              = width + 'px';
      this.height             = height + 'px';
      ɵdetectChanges(this);
    });
  }

  ngAfterViewInit(): void {
    this.mousedownProvider.setHandles([
      [this.bothHandle.nativeElement, 'both'],
      [this.verticalHandle.nativeElement, 'vertical'],
      [this.horizontalHandle.nativeElement, 'horizontal']
    ]);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  recalculateInitialValue(): void {
    this.resizeMediator.recalculateInitialValue();
  }
}
