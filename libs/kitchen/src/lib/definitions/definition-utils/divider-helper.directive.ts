import { AfterViewInit, Directive, Input, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { SlotDirection } from '@common/public-api';

const MAX_SIZE = 3;
const MIN_SIZE = 1;
const GAP = 6;

@Directive({ selector: '[kitchenDividerHelper]' })
export class DividerHelperDirective implements OnInit, OnDestroy, AfterViewInit {
  private direction: SlotDirection;
  private innerElement: HTMLDivElement;
  private resizeObserver: ResizeObserver;

  @Input() set kitchenDividerHelper(direction: SlotDirection) {
    this.direction = direction;
  }

  private get nativeElement(): HTMLElement {
    return this.viewContainerRef.element.nativeElement;
  }

  constructor(private viewContainerRef: ViewContainerRef, private renderer2: Renderer2) {
  }

  ngOnInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.setStyles();
    });
    this.resizeObserver.observe(this.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver.unobserve(this.nativeElement);
  }

  ngAfterViewInit() {
    this.createElement();
  }

  private createElement() {
    this.innerElement = this.renderer2.createElement('div');
    this.renderer2.appendChild(this.nativeElement, this.innerElement);
    this.setStyles();
  }

  private setStyles() {
    if (!this.needShow()) {
      this.setInnerStyle('display', 'none');
      return;
    }

    this.setInnerStyle('display', 'block');

    let sizeProp = 'height';
    let translate = 'translate(0, -50%)';
    let left = '0';
    let top = '50%';

    if (this.direction === 'column') {
      sizeProp = 'width';
      translate = 'translate(-50%, 0)';
      left = '50%';
      top = '0';
    }

    this.setInnerStyle('left', left);
    this.setInnerStyle('top', top);
    this.setInnerStyle(sizeProp, `calc(100% + ${GAP}px)`);
    this.setInnerStyle('transform', translate);
  }

  private needShow(): boolean {
    const size = this.direction === 'row' ? this.nativeElement.offsetHeight : this.nativeElement.offsetWidth;
    return size >= MIN_SIZE && size <= MAX_SIZE;
  }

  private setInnerStyle(key: string, value: string) {
    if (this.innerElement) {
      this.renderer2.setStyle(this.innerElement, key, value);
    }
  }
}
