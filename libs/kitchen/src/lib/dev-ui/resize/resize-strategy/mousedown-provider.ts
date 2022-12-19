import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

export type ResizeDimension = 'horizontal' | 'vertical' | 'both';

export interface MousedownEvent {
  e: MouseEvent;
  dimension: ResizeDimension;
}

@Injectable()
export class MousedownProvider implements OnDestroy {
  private mousedown = new Subject<MousedownEvent>();
  mousedown$: Observable<MousedownEvent> = this.mousedown;
  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  setHandles(handles: [HTMLElement, ResizeDimension][]): void {
    merge(
      ...handles.map(([handle, dimension]) => {
        return fromEvent(handle, 'mousedown').pipe(map((e: MouseEvent) => ({ e, dimension })));
      })
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.mousedown);
  }
}
