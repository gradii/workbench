import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, EMPTY, fromEvent, Observable, Subject } from 'rxjs';
import { catchError, filter, map, pluck, repeat, takeUntil } from 'rxjs/operators';

interface StepSize {
  width: number;
  height: number;
}

const noopStepSize = { width: 0, height: 0 };

@Injectable()
export class StepSizeProviderService implements OnDestroy {
  private destroyed$ = new Subject<void>();
  private stepSize$ = new BehaviorSubject<StepSize>(noopStepSize);

  readonly width$: Observable<number> = this.stepSize$.pipe(pluck('width'));

  readonly height$: Observable<number> = this.stepSize$.pipe(pluck('height'));

  constructor() {
    // TODO use communication service
    fromEvent(window, 'message')
      .pipe(
        pluck('data'),
        map((data: string) => JSON.parse(data)),
        catchError(() => EMPTY),
        repeat(),
        filter(({ action }) => action === 'publish-size'),
        takeUntil(this.destroyed$)
      )
      .subscribe((stepSize: StepSize) => {
        this.stepSize$.next(stepSize);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
