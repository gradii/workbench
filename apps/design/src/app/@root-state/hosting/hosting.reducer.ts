import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Hosting } from '@root-state/hosting/hosting.model';
import { HostingActions } from '@root-state/hosting/hosting.actions';

export namespace fromHosting {
  export interface State extends EntityState<Hosting> {
    projectId: string;
    loading: boolean;
    deploymentLoading: boolean;
    canUpdateInBakground: boolean;
  }

  const adapter: EntityAdapter<Hosting> = createEntityAdapter<Hosting>({
    selectId: (hosting: Hosting) => hosting.id
  });

  const initialState: State = adapter.getInitialState({
    projectId: null,
    loading: false,
    deploymentLoading: false,
    canUpdateInBakground: false
  });

  export const reducer = createReducer(
    initialState,
    on(HostingActions.setProjectId, (state, { projectId }) => {
      return { ...state, projectId };
    }),
    on(HostingActions.setLoading, (state, { loading }) => {
      return { ...state, loading };
    }),
    on(HostingActions.setRequestDeploymentLoading, (state, { loading }) => {
      return { ...state, deploymentLoading: loading };
    }),
    on(HostingActions.setHostings, (state, { hostings }) => {
      return adapter.setAll(hostings, state);
    }),
    on(HostingActions.updateHosting, (state, { hosting }) => {
      return adapter.updateOne({ id: hosting.id, changes: hosting }, state);
    }),
    on(HostingActions.addDomain, (state, { hostingId, domain }) => {
      return adapter.updateOne({ id: hostingId, changes: { domain } }, state);
    }),

    on(HostingActions.deleteDomainSuccess, (state, { hostingId }) => {
      return adapter.updateOne({ id: hostingId, changes: { domain: null } }, state);
    }),

    on(HostingActions.setBackgroundUpdates, (state, { canUpdate }) => {
      return { ...state, canUpdateInBakground: canUpdate };
    }),

    on(HostingActions.clearState, () => {
      return initialState;
    })
  );

  export const { selectAll, selectEntities } = adapter.getSelectors();
}
