import { ElementRef, Injectable } from '@angular/core';

@Injectable()
export class ScrollService {
  scrollIfNeed(ref: ElementRef<HTMLElement>, topGap: number): void {
    const { parentElement, offsetTop } = ref.nativeElement;
    const { offsetHeight } = parentElement;
    if (this.outParentViewport(ref.nativeElement, parentElement, topGap)) {
      this.scrollTo(parentElement, 0, offsetTop - offsetHeight * 0.5);
    }
  }

  private scrollTo(element: HTMLElement, x: number, y: number): void {
    if (!element.scrollTo || !('scrollBehavior' in document.documentElement.style)) {
      element.scrollTop = y;
      element.scrollLeft = x;
      return;
    }
    element.scrollTo({
      top: y,
      left: x,
      behavior: 'smooth'
    });
  }

  private outParentViewport(element: HTMLElement, parent: HTMLElement, topGap: number): boolean {
    let { offsetTop } = element;
    const { offsetHeight, scrollTop } = parent;
    offsetTop -= topGap;
    return scrollTop > offsetTop || offsetTop > scrollTop + offsetHeight;
  }
}
