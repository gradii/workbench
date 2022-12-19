import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import { EntitiesState, setEntities, updateEntities, withEntities } from '@ngneat/elf-entities';
import { HostingView } from '@root-state/hosting/hosting-view.model';
import { HostingActions } from '@root-state/hosting/hosting.actions';
import { tap } from 'rxjs/operators';

export namespace fromHostingView {
  export interface State {
    entities: EntitiesState<HostingView>;
  }

  const initialState: State = {
    entities: {}
  };

  const { state, config } = createState(
    withProps<State>(initialState),
    withEntities<HostingView>()
  );

  export const fromHostingStore = new Store({ name: 'kitchen-hosting', state, config });

  export class ReducerEffect {
    reducerEffect = createEffect((actions) => actions.pipe(
      tap((action) => {
        switch (action.type) {
          case HostingActions.setHostings:
            return fromHostingStore.update(setEntities(action.hostings.map(hosting => ({ id: hosting.id }))));
          case HostingActions.assignDomain:
            return fromHostingStore.update(
              updateEntities(action.hostingId, { assignDomainLoading: true, assignDomainError: false }));
          case HostingActions.assignDomainSuccess:
            return fromHostingStore.update(
              updateEntities(action.hostingId, { assignDomainLoading: false, assignDomainError: false }));
          case HostingActions.assignDomainFailed:
            return fromHostingStore.update(
              updateEntities(action.hostingId, { assignDomainLoading: false, assignDomainError: true }));
          case HostingActions.deleteDomain:
            return fromHostingStore.update(
              updateEntities(action.hostingId, { deleteDomainLoading: true, deleteDomainError: false }));
          case HostingActions.deleteDomainSuccess:
            return fromHostingStore.update(
              updateEntities(action.hostingId, { deleteDomainLoading: false, deleteDomainError: false }));
          case HostingActions.deleteDomainFailed:
            return fromHostingStore.update(
              updateEntities(action.hostingId, { deleteDomainLoading: false, deleteDomainError: true }));
          case HostingActions.clearState:
            return fromHostingStore.reset();
        }
      }))
    );
  }

  // export const reducer = createReducer(
  //   initialState,
  //   on(HostingActions.setHostings, (state, { hostings }) => {
  //     return adapter.setAll(
  //       hostings.map(hosting => ({ id: hosting.id })),
  //       state
  //     );
  //   }),
  //   on(HostingActions.assignDomain, (state, { hostingId }) => {
  //     return adapter.updateOne(
  //       { id: hostingId, changes: { assignDomainLoading: true, assignDomainError: false } },
  //       state
  //     );
  //   }),
  //   on(HostingActions.assignDomainSuccess, (state, { hostingId }) => {
  //     return adapter.updateOne(
  //       { id: hostingId, changes: { assignDomainLoading: false, assignDomainError: false } },
  //       state
  //     );
  //   }),
  //   on(HostingActions.assignDomainFailed, (state, { hostingId }) => {
  //     return adapter.updateOne(
  //       { id: hostingId, changes: { assignDomainLoading: false, assignDomainError: true } },
  //       state
  //     );
  //   }),
  //
  //   on(HostingActions.deleteDomain, (state, { hostingId }) => {
  //     return adapter.updateOne(
  //       { id: hostingId, changes: { deleteDomainLoading: true, deleteDomainError: false } },
  //       state
  //     );
  //   }),
  //
  //   on(HostingActions.deleteDomainSuccess, (state, { hostingId }) => {
  //     return adapter.updateOne(
  //       { id: hostingId, changes: { deleteDomainLoading: false, deleteDomainError: false } },
  //       state
  //     );
  //   }),
  //
  //   on(HostingActions.deleteDomainFailed, (state, { hostingId }) => {
  //     return adapter.updateOne(
  //       { id: hostingId, changes: { deleteDomainLoading: false, deleteDomainError: true } },
  //       state
  //     );
  //   }),
  //
  //   on(HostingActions.clearState, () => {
  //     return initialState;
  //   })
  // );

  // export const { selectAll, selectEntities } = adapter.getSelectors();
}
