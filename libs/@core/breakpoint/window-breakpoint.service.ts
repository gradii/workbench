import { Injectable } from '@angular/core';
import { getBreakpointWidth } from '@common/public-api';
import { fromEvent, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith, throttleTime } from 'rxjs/operators';

import { AVAILABLE_BREAKPOINTS, Breakpoint } from './breakpoint';

@Injectable({ providedIn: 'root' })
export class WindowBreakpointService {
  private window: Window;

  constructor() {
    this.window = window;
  }

  getActiveBreakpoint(window: Window): Breakpoint {
    return this.convertWidthToBreakpoint(window.innerWidth);
  }

  breakpointChangesWithInitial(width: number): Observable<Breakpoint> {
    return this.breakpointChanges().pipe(startWith(this.convertWidthToBreakpoint(width)));
  }

  breakpointChanges(): Observable<Breakpoint> {
    return fromEvent(this.window, 'resize').pipe(
      map(event => (event.target as Window).innerWidth),
      throttleTime(100),
      map((innerWidth: number) => this.convertWidthToBreakpoint(innerWidth)),
      distinctUntilChanged()
    );
  }

  convertWidthToBreakpoint(innerWidth: number): Breakpoint {
    const currentBreakpoint = AVAILABLE_BREAKPOINTS.slice()
      .reverse()
      .find(({ width }) => {
        return innerWidth <= getBreakpointWidth(width);
      });

    if (!currentBreakpoint) {
      return AVAILABLE_BREAKPOINTS[0];
    }

    return currentBreakpoint;
  }
}
