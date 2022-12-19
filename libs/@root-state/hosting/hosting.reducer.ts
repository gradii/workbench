import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import { EntitiesState, setEntities, updateEntities, withEntities } from '@ngneat/elf-entities';
import { HostingActions } from '@root-state/hosting/hosting.actions';
import { Hosting } from '@root-state/hosting/hosting.model';
import { tap } from 'rxjs/operators';

export namespace fromHosting {
  export interface State {
    projectId: string;
    loading: boolean;
    deploymentLoading: boolean;
    canUpdateInBakground: boolean;
    entities: EntitiesState<Hosting>;
  }

  const initialState: State = {
    projectId           : null,
    loading             : false,
    deploymentLoading   : false,
    canUpdateInBakground: false,
    entities: {}
  };

  const { state, config } = createState(
    withProps<State>(initialState),
    withEntities<Hosting>()
  );

  export const fromHostingStore = new Store({ name: 'kitchen-hosting', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect((actions) => actions.pipe(
      tap((action) => {
        switch (action.type) {
          case HostingActions.setProjectId:
            return fromHostingStore.update((state) => ({
              ...state,
              projectId: action.projectId
            }));
          case HostingActions.setLoading:
            return fromHostingStore.update((state) => ({
              ...state,
              loading: action.loading
            }));
          case HostingActions.setRequestDeploymentLoading:
            return fromHostingStore.update((state) => ({
              ...state,
              deploymentLoading: action.loading
            }));
          case HostingActions.setHostings:
            return fromHostingStore.update(setEntities(action.hostings));
          case HostingActions.updateHosting:
            return fromHostingStore.update(updateEntities(
              action.hosting.id,
              (entity) => ({ ...entity, ...action.hosting }))
            );
          case HostingActions.addDomain:
            return fromHostingStore.update(updateEntities(
              action.hostingId,
              (entity) => ({ ...entity, domain: action.domain }))
            );
          case HostingActions.deleteDomainSuccess:
            return fromHostingStore.update(updateEntities(
              action.hostingId,
              (entity) => ({ ...entity, domain: null }))
            );
          case HostingActions.setBackgroundUpdates:
            return fromHostingStore.update((state) => ({
              ...state,
              canUpdateInBakground: action.canUpdate
            }));
          case HostingActions.clearState:
            return fromHostingStore.reset();
        }
      })
    ));
  }

  //
  // export const reducer = createReducer(
  //   initialState,
  //   on(HostingActions.setProjectId, (state, { projectId }) => {
  //     return { ...state, projectId };
  //   }),
  //   on(HostingActions.setLoading, (state, { loading }) => {
  //     return { ...state, loading };
  //   }),
  //   on(HostingActions.setRequestDeploymentLoading, (state, { loading }) => {
  //     return { ...state, deploymentLoading: loading };
  //   }),
  //   on(HostingActions.setHostings, (state, { hostings }) => {
  //     return adapter.setAll(hostings, state);
  //   }),
  //   on(HostingActions.updateHosting, (state, { hosting }) => {
  //     return adapter.updateOne({ id: hosting.id, changes: hosting }, state);
  //   }),
  //   on(HostingActions.addDomain, (state, { hostingId, domain }) => {
  //     return adapter.updateOne({ id: hostingId, changes: { domain } }, state);
  //   }),
  //
  //   on(HostingActions.deleteDomainSuccess, (state, { hostingId }) => {
  //     return adapter.updateOne({ id: hostingId, changes: { domain: null } }, state);
  //   }),
  //
  //   on(HostingActions.setBackgroundUpdates, (state, { canUpdate }) => {
  //     return { ...state, canUpdateInBakground: canUpdate };
  //   }),
  //
  //   on(HostingActions.clearState, () => {
  //     return initialState;
  //   })
  // );

  // export const { selectAll, selectEntities } = adapter.getSelectors();
}
