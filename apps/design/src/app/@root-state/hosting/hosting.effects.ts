import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom, filter, delay, mergeMap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { onlyLatestFrom } from '@common';
import { HostingActions } from '@root-state/hosting/hosting.actions';
import { HostingService } from '@root-state/hosting/hosting.service';
import { Hosting } from '@root-state/hosting/hosting.model';
import { fromHosting } from '@root-state/hosting/hosting.reducer';
import { getHostings, getHostingProjectId, getCanUpdateInBackground } from './hosting.selectors';

@Injectable()
export class HostingEffects {
  hostings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HostingActions.loadHostings, HostingActions.requestHostingsUpdate),
      switchMap(({ projectId }) =>
        this.hostingService.loadHostings(projectId).pipe(
          map((hostings: Hosting[]) => HostingActions.setHostings({ hostings })),
          catchError(() => {
            return EMPTY;
          }),
          tap(() => this.store.dispatch(HostingActions.setLoading({ loading: false })))
        )
      )
    )
  );

  assignDomain$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HostingActions.assignDomain),
      switchMap(({ hostingId, domain }) =>
        this.hostingService.assignDomain(hostingId, domain).pipe(
          map((hosting: Hosting) => HostingActions.updateHosting({ hosting })),
          tap(() => this.store.dispatch(HostingActions.assignDomainSuccess({ hostingId }))),
          catchError(() => {
            return of(HostingActions.assignDomainFailed({ hostingId }));
          })
        )
      )
    )
  );

  deleteDomain$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HostingActions.deleteDomain),
      switchMap(({ hostingId }) =>
        this.hostingService.deleteDomain(hostingId).pipe(
          map((hosting: Hosting) => HostingActions.updateHosting({ hosting })),
          tap(() => this.store.dispatch(HostingActions.deleteDomainSuccess({ hostingId }))),
          catchError(() => {
            return of(HostingActions.deleteDomainFailed({ hostingId }));
          })
        )
      )
    )
  );

  hasTemporaryStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HostingActions.setHostings, HostingActions.updateHosting),
      withLatestFrom(this.store.pipe(select(getHostings))),
      withLatestFrom(this.store.pipe(select(getCanUpdateInBackground))),
      filter(([[action, hostings], canUpdate]) => canUpdate && this.shouldRetryHostingsRequest(hostings)),
      delay(40000),
      onlyLatestFrom(this.store.pipe(select(getHostingProjectId))),
      filter(projectId => !!projectId),
      map(projectId => {
        return HostingActions.requestHostingsUpdate({ projectId });
      })
    )
  );

  deployHosting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HostingActions.deployHosting),
      tap(() => this.store.dispatch(HostingActions.setRequestDeploymentLoading({ loading: true }))),
      mergeMap(({ hostingId, app, name }) =>
        this.hostingService.deployHosting(hostingId, app, name).pipe(
          map((hosting: Hosting) => HostingActions.updateHosting({ hosting })),
          catchError(() => EMPTY),
          tap(() => this.store.dispatch(HostingActions.setRequestDeploymentLoading({ loading: false })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromHosting.State>,
    private hostingService: HostingService
  ) {
  }

  private shouldRetryHostingsRequest(hostings: Hosting[]): boolean {
    return !!hostings.find(hosting => {
      return hosting.configured && hosting.currentShouldRetry;
    });
  }
}
