import { createAction, props } from '@ngrx/store';
import { Hosting } from '@root-state/hosting/hosting.model';
import { OvenApp } from '@common';

export namespace HostingActions {
  export const setProjectId = createAction('[Hosting] Set Project Id', props<{ projectId: string }>());
  export const loadHostings = createAction('[Hosting] Load Hostings', props<{ projectId: string }>());
  export const setLoading = createAction('[Hosting] Loading', props<{ loading: boolean }>());
  export const setHostings = createAction('[Hosting] Set Hostings', props<{ hostings: Hosting[] }>());
  export const updateHosting = createAction('[Hosting] Update Hosting', props<{ hosting: Hosting }>());
  export const setRequestDeploymentLoading = createAction(
    '[Hosting] Set Requested Hosting Deployment Loading',
    props<{ loading: boolean }>()
  );
  export const requestHostingsUpdate = createAction(
    '[Hosting] Request Hostings Update',
    props<{ projectId: string }>()
  );
  export const deployHosting = createAction(
    '[Hosting] Deploy Hosting',
    props<{ hostingId: number; app: OvenApp; name: string }>()
  );
  export const addDomain = createAction('[Hosting] Add Domain', props<{ hostingId: number; domain: string }>());
  export const assignDomain = createAction('[Hosting] Assign Domain', props<{ hostingId: number; domain: string }>());
  export const assignDomainSuccess = createAction('[Hosting] Assign Domain Success', props<{ hostingId: number }>());
  export const assignDomainFailed = createAction('[Hosting] Assign Domain Failed', props<{ hostingId: number }>());

  export const deleteDomain = createAction('[Hosting] Delete Domain', props<{ hostingId: number }>());
  export const deleteDomainSuccess = createAction('[Hosting] Delete Domain Success', props<{ hostingId: number }>());
  export const deleteDomainFailed = createAction('[Hosting] Delete Domain Failed', props<{ hostingId: number }>());

  export const setBackgroundUpdates = createAction('[Hosting] Set Background Updates', props<{ canUpdate: boolean }>());

  export const clearState = createAction('[Hosting] Clear State');
}
