import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Hosting } from '@root-state/hosting/hosting.model';
import { getHostingDeploymentLoading, getHostings, getHostingsLoading } from '@root-state/hosting/hosting.selectors';
import { HostingActions } from '@root-state/hosting/hosting.actions';
import { OvenApp } from '@common';
import { fromHosting } from './hosting.reducer';
import { getHostingViewEntities } from './hosting-view.selectors';

@Injectable({ providedIn: 'root' })
export class HostingFacade {
  readonly hostings$: Observable<Hosting[]> = this.store.pipe(select(getHostings));

  readonly loading$: Observable<boolean> = this.store.pipe(select(getHostingsLoading));

  readonly deploymentLoading$: Observable<boolean> = this.store.pipe(select(getHostingDeploymentLoading));

  readonly hostingView$ = this.store.pipe(select(getHostingViewEntities));

  constructor(private store: Store<fromHosting.State>) {
  }

  loadHostings(projectId: string): void {
    this.store.dispatch(HostingActions.setProjectId({ projectId }));
    this.store.dispatch(HostingActions.loadHostings({ projectId }));
    this.store.dispatch(HostingActions.setLoading({ loading: true }));
  }

  deployHostings(hostings: Hosting[], app: OvenApp, name: string): void {
    hostings.forEach(hosting =>
      this.store.dispatch(HostingActions.deployHosting({ hostingId: hosting.id, app, name }))
    );
  }

  addDomain(hostingId: number, domain: string) {
    this.store.dispatch(HostingActions.addDomain({ hostingId, domain }));
  }

  assignDomain(hostingId: number, domain: string) {
    this.store.dispatch(HostingActions.assignDomain({ hostingId, domain }));
  }

  deleteDomain(hostingId: number) {
    this.store.dispatch(HostingActions.deleteDomain({ hostingId }));
  }

  setBackgroundUpdates(canUpdate: boolean) {
    this.store.dispatch(HostingActions.setBackgroundUpdates({ canUpdate }));
  }

  clearState() {
    this.store.dispatch(HostingActions.clearState());
  }
}
