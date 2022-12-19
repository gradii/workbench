import { Hosting } from '@root-state/hosting/hosting.model';
import { KitchenApp } from '@common/public-api';
import { createAction } from '@ngneat/effects';

export namespace HostingActions {
  export const setProjectId                = createAction('[Hosting] Set Project Id',
    (projectId: string) => ({ projectId }));
  export const loadHostings                = createAction('[Hosting] Load Hostings',
    (projectId: string) => ({ projectId }));
  export const setLoading                  = createAction('[Hosting] Loading', (loading: boolean) => ({ loading }));
  export const setHostings                 = createAction('[Hosting] Set Hostings',
    (hostings: Hosting[]) => ({ hostings }));
  export const updateHosting               = createAction('[Hosting] Update Hosting',
    (hosting: Hosting) => ({ hosting }));
  export const setRequestDeploymentLoading = createAction(
    '[Hosting] Set Requested Hosting Deployment Loading',
    (loading: boolean) => ({ loading })
  );
  export const requestHostingsUpdate       = createAction(
    '[Hosting] Request Hostings Update',
    (projectId: string) => ({ projectId })
  );
  export const deployHosting               = createAction(
    '[Hosting] Deploy Hosting',
    (hostingId: number, app: KitchenApp, name: string) => ({ hostingId, app, name })
  );
  export const addDomain                   = createAction('[Hosting] Add Domain',
    (hostingId: number, domain: string) => ({ hostingId, domain }));
  export const assignDomain                = createAction('[Hosting] Assign Domain',
    (hostingId: number, domain: string) => ({ hostingId, domain }));
  export const assignDomainSuccess         = createAction('[Hosting] Assign Domain Success',
    (hostingId: number) => ({ hostingId }));
  export const assignDomainFailed          = createAction('[Hosting] Assign Domain Failed',
    (hostingId: number) => ({ hostingId }));

  export const deleteDomain        = createAction('[Hosting] Delete Domain', (hostingId: number) => ({ hostingId }));
  export const deleteDomainSuccess = createAction('[Hosting] Delete Domain Success',
    (hostingId: number) => ({ hostingId }));
  export const deleteDomainFailed  = createAction('[Hosting] Delete Domain Failed',
    (hostingId: number) => ({ hostingId }));

  export const setBackgroundUpdates = createAction('[Hosting] Set Background Updates',
    (canUpdate: boolean) => ({ canUpdate }));

  export const clearState = createAction('[Hosting] Clear State');
}
