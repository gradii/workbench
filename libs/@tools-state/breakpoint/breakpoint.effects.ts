import { Injectable } from '@angular/core';
import { BreakpointChangeSyncReason } from '@common/public-api';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { createEffect, ofType } from '@ngneat/effects';
import { CommunicationService } from '@shared/communication/communication.service';

import { BreakpointActions } from '@tools-state/breakpoint/breakpoint.actions';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class BreakpointEffects {
  breakpoint$ = createEffect((actions) =>
    actions.pipe(
      ofType(BreakpointActions.SelectBreakpoint),
      tap(({ breakpoint }: { breakpoint: Breakpoint }) => this.communication.setBreakpoint(breakpoint.width)),
      map(() => WorkingAreaActions.SyncState(new BreakpointChangeSyncReason()))
    ), { dispatch: true }
  );

  constructor(private communication: CommunicationService) {
  }
}
