import { Injectable } from '@angular/core';

import { onlyLatestFrom } from '@common/public-api';
import { createEffect, dispatch, ofType } from '@ngneat/effects';
import { HostingActions } from '@root-state/hosting/hosting.actions';
import { Hosting } from '@root-state/hosting/hosting.model';
import { HostingService } from '@root-state/hosting/hosting.service';
import { EMPTY, of } from 'rxjs';
import { catchError, delay, filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { getCanUpdateInBackground, getHostingProjectId, getHostings } from './hosting.selectors';

@Injectable()
export class HostingEffects {
  hostings$ = createEffect((actions) =>
    actions.pipe(
      ofType(HostingActions.loadHostings, HostingActions.requestHostingsUpdate),
      switchMap(({ projectId }) =>
        this.hostingService.loadHostings(projectId).pipe(
          map((hostings: Hosting[]) => HostingActions.setHostings(hostings)),
          catchError(() => {
            return EMPTY;
          }),
          tap(() => dispatch(HostingActions.setLoading(false)))
        )
      )
    )
  );

  assignDomain$ = createEffect((actions) =>
    actions.pipe(
      ofType(HostingActions.assignDomain),
      switchMap(({ hostingId, domain }) =>
        this.hostingService.assignDomain(hostingId, domain).pipe(
          map((hosting: Hosting) => HostingActions.updateHosting(hosting)),
          tap(() => dispatch(HostingActions.assignDomainSuccess(hostingId))),
          catchError(() => {
            return of(HostingActions.assignDomainFailed(hostingId));
          })
        )
      )
    )
  );

  deleteDomain$ = createEffect((actions) =>
    actions.pipe(
      ofType(HostingActions.deleteDomain),
      switchMap(({ hostingId }) =>
        this.hostingService.deleteDomain(hostingId).pipe(
          map((hosting: Hosting) => HostingActions.updateHosting(hosting)),
          tap(() => dispatch(HostingActions.deleteDomainSuccess(hostingId))),
          catchError(() => {
            return of(HostingActions.deleteDomainFailed(hostingId));
          })
        )
      )
    )
  );

  hasTemporaryStatus$ = createEffect((actions) =>
    actions.pipe(
      ofType(HostingActions.setHostings, HostingActions.updateHosting),
      withLatestFrom(getHostings),
      withLatestFrom(getCanUpdateInBackground),
      filter(([[action, hostings], canUpdate]) => canUpdate && this.shouldRetryHostingsRequest(hostings)),
      delay(40000),
      onlyLatestFrom(getHostingProjectId),
      filter(projectId => !!projectId),
      map(projectId => {
        return HostingActions.requestHostingsUpdate(projectId);
      })
    )
  );

  deployHosting$ = createEffect((actions) =>
    actions.pipe(
      ofType(HostingActions.deployHosting),
      tap(() => dispatch(HostingActions.setRequestDeploymentLoading(true))),
      mergeMap(({ hostingId, app, name }) =>
        this.hostingService.deployHosting(hostingId, app, name).pipe(
          map((hosting: Hosting) => HostingActions.updateHosting(hosting)),
          catchError(() => EMPTY),
          tap(() => dispatch(HostingActions.setRequestDeploymentLoading(false)))
        )
      )
    )
  );

  constructor(
    private hostingService: HostingService
  ) {
  }

  private shouldRetryHostingsRequest(hostings: Hosting[]): boolean {
    return !!hostings.find(hosting => {
      return hosting.configured && hosting.currentShouldRetry;
    });
  }
}
