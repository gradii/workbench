import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { HostingView } from '@root-state/hosting/hosting-view.model';
import { HostingActions } from '@root-state/hosting/hosting.actions';

export namespace fromHostingView {
  export interface State extends EntityState<HostingView> {
  }

  const adapter: EntityAdapter<HostingView> = createEntityAdapter<HostingView>({
    selectId: (hosting: HostingView) => hosting.id
  });

  const initialState: State = adapter.getInitialState();

  export const reducer = createReducer(
    initialState,
    on(HostingActions.setHostings, (state, { hostings }) => {
      return adapter.setAll(
        hostings.map(hosting => ({ id: hosting.id })),
        state
      );
    }),
    on(HostingActions.assignDomain, (state, { hostingId }) => {
      return adapter.updateOne(
        { id: hostingId, changes: { assignDomainLoading: true, assignDomainError: false } },
        state
      );
    }),
    on(HostingActions.assignDomainSuccess, (state, { hostingId }) => {
      return adapter.updateOne(
        { id: hostingId, changes: { assignDomainLoading: false, assignDomainError: false } },
        state
      );
    }),
    on(HostingActions.assignDomainFailed, (state, { hostingId }) => {
      return adapter.updateOne(
        { id: hostingId, changes: { assignDomainLoading: false, assignDomainError: true } },
        state
      );
    }),

    on(HostingActions.deleteDomain, (state, { hostingId }) => {
      return adapter.updateOne(
        { id: hostingId, changes: { deleteDomainLoading: true, deleteDomainError: false } },
        state
      );
    }),

    on(HostingActions.deleteDomainSuccess, (state, { hostingId }) => {
      return adapter.updateOne(
        { id: hostingId, changes: { deleteDomainLoading: false, deleteDomainError: false } },
        state
      );
    }),

    on(HostingActions.deleteDomainFailed, (state, { hostingId }) => {
      return adapter.updateOne(
        { id: hostingId, changes: { deleteDomainLoading: false, deleteDomainError: true } },
        state
      );
    }),

    on(HostingActions.clearState, () => {
      return initialState;
    })
  );

  export const { selectAll, selectEntities } = adapter.getSelectors();
}
