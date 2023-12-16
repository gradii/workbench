import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { BreakpointChangeSyncReason } from '@common';

import { BreakpointActions } from '@tools-state/breakpoint/breakpoint.actions';
import { CommunicationService } from '@shared/communication/communication.service';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { Breakpoint } from '@core/breakpoint/breakpoint';

@Injectable()
export class BreakpointEffects {
  breakpoint$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BreakpointActions.ActionTypes.SelectBreakpoint),
      tap(({ breakpoint }: { breakpoint: Breakpoint }) => this.communication.setBreakpoint(breakpoint.width)),
      map(() => new WorkingAreaActions.SyncState(new BreakpointChangeSyncReason()))
    )
  );

  constructor(private actions$: Actions, private communication: CommunicationService) {
  }
}
