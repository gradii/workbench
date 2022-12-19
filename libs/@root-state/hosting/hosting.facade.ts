import { Injectable } from '@angular/core';
import { KitchenApp } from '@common/public-api';
import { dispatch } from '@ngneat/effects';
import { HostingActions } from '@root-state/hosting/hosting.actions';

import { Hosting } from '@root-state/hosting/hosting.model';
import { getHostingDeploymentLoading, getHostings, getHostingsLoading } from '@root-state/hosting/hosting.selectors';
import { Observable } from 'rxjs';
import { getHostingViewEntities } from './hosting-view.selectors';

@Injectable({ providedIn: 'root' })
export class HostingFacade {
  readonly hostings$: Observable<Hosting[]> = getHostings;

  readonly loading$: Observable<boolean> = getHostingsLoading;

  readonly deploymentLoading$: Observable<boolean> = getHostingDeploymentLoading;

  readonly hostingView$ = getHostingViewEntities;

  constructor() {
  }

  loadHostings(projectId: string): void {
    dispatch(HostingActions.setProjectId(projectId));
    dispatch(HostingActions.loadHostings(projectId));
    dispatch(HostingActions.setLoading(true));
  }

  deployHostings(hostings: Hosting[], app: KitchenApp, name: string): void {
    hostings.forEach(hosting =>
      dispatch(HostingActions.deployHosting(hosting.id, app, name))
    );
  }

  addDomain(hostingId: number, domain: string) {
    dispatch(HostingActions.addDomain(hostingId, domain));
  }

  assignDomain(hostingId: number, domain: string) {
    dispatch(HostingActions.assignDomain(hostingId, domain));
  }

  deleteDomain(hostingId: number) {
    dispatch(HostingActions.deleteDomain(hostingId));
  }

  setBackgroundUpdates(canUpdate: boolean) {
    dispatch(HostingActions.setBackgroundUpdates(canUpdate));
  }

  clearState() {
    dispatch(HostingActions.clearState());
  }
}
