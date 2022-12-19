import { BillingInfo } from '@account-state/billing/billing-info.model';

import { BillingActions } from '@account-state/billing/billing.actions';
import { Payment } from '@account-state/billing/payment.model';
import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import { tap } from 'rxjs/operators';

export namespace fromBilling {
  export interface State {
    billingInfo: BillingInfo;
    loadBillingInfo: boolean;
    loadBillingInfoFailed: boolean;

    updatePaymentMethodLoading: boolean;
    updatePaymentMethodFailed: boolean;

    deletePaymentMethodLoading: boolean;
    deletePaymentMethodFailed: boolean;

    changePlanLoading: boolean;
    changePlanFailed: boolean;
    changePlanSuccess: boolean;

    paymentHistory: Payment[];
    paymentHistoryLoading: boolean;
    paymentHistoryLoadingFailed: boolean;
  }

  const initialState: State = {
    billingInfo          : null,
    loadBillingInfo      : false,
    loadBillingInfoFailed: false,

    updatePaymentMethodLoading: false,
    updatePaymentMethodFailed : false,

    deletePaymentMethodLoading: false,
    deletePaymentMethodFailed : false,

    changePlanLoading: false,
    changePlanFailed : false,
    changePlanSuccess: false,

    paymentHistory             : [],
    paymentHistoryLoading      : false,
    paymentHistoryLoadingFailed: false
  };

  const { state, config } = createState(
    withProps<State>(initialState)
  );

  export const fromBillingStore = new Store({ name: 'kitchen-billing', state, config });

  export class FromBillingReducer {
    loadBillingInfo() {
      return fromBillingStore.update(state => ({
        ...state,
        loadBillingInfo      : true,
        loadBillingInfoFailed: false
      }));
    }

    loadBillingInfoSuccess(billingInfo: BillingInfo) {
      return fromBillingStore.update(state => ({
        ...state,
        billingInfo,
        loadBillingInfo: false
      }));
    }

    loadBillingInfoFailed() {
      return fromBillingStore.update(state => ({
        ...state,
        loadBillingInfo      : false,
        loadBillingInfoFailed: true
      }));
    }

    updatePaymentMethod() {
      return fromBillingStore.update(state => ({
        ...state,
        updatePaymentMethodLoading: true,
        updatePaymentMethodFailed : false
      }));
    }

    updatePaymentMethodSuccess(billingInfo: BillingInfo) {
      return fromBillingStore.update(state => ({
        ...state,
        updatePaymentMethodLoading: false,
        updatePaymentMethodFailed : false
      }));
    }

    updatePaymentMethodFailed() {
      return fromBillingStore.update(state => ({
        ...state,
        updatePaymentMethodLoading: false,
        updatePaymentMethodFailed : true
      }));
    }

    clearUpdatePaymentMethodFailed() {
      return fromBillingStore.update(state => ({
        ...state,
        updatePaymentMethodFailed: false
      }));
    }

    deletePaymentMethod() {
      return fromBillingStore.update(state => ({
        ...state,
        deletePaymentMethodLoading: true,
        deletePaymentMethodFailed : false
      }));
    }

    deletePaymentMethodSuccess(billingInfo: BillingInfo) {
      return fromBillingStore.update(state => ({
        ...state,
        billingInfo,
        deletePaymentMethodLoading: false,
        deletePaymentMethodFailed : false
      }));
    }

    deletePaymentMethodFailed() {
      return fromBillingStore.update(state => ({
        ...state,
        deletePaymentMethodLoading: false,
        deletePaymentMethodFailed : true
      }));
    }

    changePlanLoading(loading: boolean) {
      return fromBillingStore.update(state => ({
        ...state,
        changePlanLoading: loading,
        changePlanFailed : false
      }));
    }

    changePlanSuccess() {
      return fromBillingStore.update(state => ({
        ...state,
        changePlanLoading: false,
        changePlanFailed : false,
        changePlanSuccess: true
      }));
    }

    changePlanFailed() {
      return fromBillingStore.update(state => ({
        ...state,
        changePlanLoading: false,
        changePlanFailed : true
      }));
    }

    loadPaymentHistory() {
      return fromBillingStore.update(state => ({
        ...state,
        paymentHistoryLoading      : true,
        paymentHistoryLoadingFailed: false
      }));
    }

    loadPaymentHistorySuccess(paymentHistory: Payment[]) {
      return fromBillingStore.update(state => ({
        ...state,
        paymentHistory,
        paymentHistoryLoading      : false,
        paymentHistoryLoadingFailed: false
      }));
    }

    loadPaymentHistoryFailed() {
      return fromBillingStore.update(state => ({
        ...state,
        paymentHistoryLoading      : false,
        paymentHistoryLoadingFailed: true
      }));
    }
  }

  export class ReducerEffect {
    reducerEffect = createEffect(
      (actions) => actions.pipe(
        tap((action) => {
          switch (action.type) {
            case BillingActions.ActionTypes.LoadBillingInfo:
              return fromBillingStore.update(state => ({
                ...state,
                loadBillingInfo      : true,
                loadBillingInfoFailed: false
              }));
            case BillingActions.ActionTypes.LoadBillingInfoSuccess:
              return fromBillingStore.update(state => ({
                ...state,
                billingInfo    : action.billingInfo,
                loadBillingInfo: false
              }));
            case BillingActions.ActionTypes.LoadBillingInfoFailed:
              return fromBillingStore.update(state => ({
                ...state,
                loadBillingInfo      : false,
                loadBillingInfoFailed: true
              }));
            case BillingActions.ActionTypes.UpdatePaymentMethod:
              return fromBillingStore.update(state => ({
                ...state,
                updatePaymentMethodLoading: true,
                updatePaymentMethodFailed : false
              }));
            case BillingActions.ActionTypes.UpdatePaymentMethodSuccess:
              return fromBillingStore.update(state => ({
                ...state,
                billingInfo               : action.billingInfo,
                updatePaymentMethodLoading: false,
                updatePaymentMethodFailed : false
              }));
            case BillingActions.ActionTypes.UpdatePaymentMethodFailed:
              return fromBillingStore.update(state => ({
                ...state,
                updatePaymentMethodLoading: false,
                updatePaymentMethodFailed : true
              }));
            case BillingActions.ActionTypes.ClearUpdatePaymentMethodFailed:
              return fromBillingStore.update(state => ({
                ...state,
                updatePaymentMethodFailed: false
              }));
            case BillingActions.ActionTypes.DeletePaymentMethod:
              return fromBillingStore.update(state => ({
                ...state,
                deletePaymentMethodLoading: true,
                deletePaymentMethodFailed : false
              }));

            case BillingActions.ActionTypes.DeletePaymentMethodSuccess:
              return fromBillingStore.update(state => ({
                ...state,
                billingInfo               : action.billingInfo,
                deletePaymentMethodLoading: false,
                deletePaymentMethodFailed : false
              }));
            case BillingActions.ActionTypes.DeletePaymentMethodFailed:
              return fromBillingStore.update(state => ({
                ...state,
                deletePaymentMethodLoading: false,
                deletePaymentMethodFailed : true
              }));
            case BillingActions.ActionTypes.ChangePlanLoading:
              return fromBillingStore.update(state => ({
                ...state,
                changePlanLoading: action.loading,
                changePlanFailed : false
              }));

            case BillingActions.ActionTypes.ChangePlanSuccess:
              return fromBillingStore.update(state => ({
                ...state,
                changePlanLoading: false,
                changePlanFailed : false,
                changePlanSuccess: true
              }));
            case BillingActions.ActionTypes.ChangePlanFailed:
              return fromBillingStore.update(state => ({
                ...state,
                changePlanLoading: false,
                changePlanFailed : true
              }));
            case BillingActions.ActionTypes.LoadPaymentHistory:
              return fromBillingStore.update(state => ({
                ...state,
                paymentHistoryLoading      : true,
                paymentHistoryLoadingFailed: false
              }));
            case BillingActions.ActionTypes.LoadPaymentHistorySuccess:
              return fromBillingStore.update(state => ({
                ...state,
                paymentHistory             : action.paymentHistory,
                paymentHistoryLoading      : false,
                paymentHistoryLoadingFailed: false
              }));
            case BillingActions.ActionTypes.LoadPaymentHistoryFailed:
              return fromBillingStore.update(state => ({
                ...state,
                paymentHistoryLoading      : false,
                paymentHistoryLoadingFailed: true
              }));
          }
        })
      )
    );
  }

  // export const reducer = createReducer(
  //   initialState,
  //
  //   on(BillingActions.loadBillingInfo, state => ({ ...state, loadBillingInfo: true })),
  //   on(BillingActions.loadBillingInfoSuccess, (state, { billingInfo }) => ({
  //     ...state,
  //     billingInfo,
  //     loadBillingInfo: false
  //   })),
  //   on(BillingActions.loadBillingInfoFailed, state => ({
  //     ...state,
  //     loadBillingInfo      : false,
  //     loadBillingInfoFailed: true
  //   })),
  //
  //   on(BillingActions.updatePaymentMethod, state => ({ ...state, updatePaymentMethodLoading: true })),
  //   on(BillingActions.updatePaymentMethodSuccess, (state, { billingInfo }) => ({
  //     ...state,
  //     billingInfo,
  //     updatePaymentMethodLoading: false,
  //     updatePaymentMethodFailed : false
  //   })),
  //   on(BillingActions.updatePaymentMethodFailed, state => ({
  //     ...state,
  //     updatePaymentMethodLoading: false,
  //     updatePaymentMethodFailed : true
  //   })),
  //   on(BillingActions.clearUpdatePaymentMethodFailed, state => ({
  //     ...state,
  //     updatePaymentMethodFailed: false
  //   })),
  //
  //   on(BillingActions.deletePaymentMethod, state => ({ ...state, deletePaymentMethodLoading: true })),
  //   on(BillingActions.deletePaymentMethodSuccess, (state, { billingInfo }) => ({
  //     ...state,
  //     billingInfo,
  //     deletePaymentMethodLoading: false,
  //     deletePaymentMethodFailed : false
  //   })),
  //   on(BillingActions.deletePaymentMethodFailed, state => ({
  //     ...state,
  //     deletePaymentMethodLoading: false,
  //     deletePaymentMethodFailed : true
  //   })),
  //
  //   on(BillingActions.changePlanLoading, (state, { loading }) => ({
  //     ...state,
  //     changePlanLoading: loading
  //   })),
  //   on(BillingActions.changePlanFailed, state => ({
  //     ...state,
  //     changePlanFailed: true
  //   })),
  //   on(BillingActions.changePlanSuccess, state => ({
  //     ...state,
  //     changePlanSuccess: true
  //   })),
  //
  //   on(BillingActions.loadPaymentHistory, state => ({
  //     ...state,
  //     paymentHistoryLoading: true
  //   })),
  //   on(BillingActions.loadPaymentHistorySuccess, (state, { paymentHistory }) => ({
  //     ...state,
  //     paymentHistory,
  //     paymentHistoryLoading      : false,
  //     paymentHistoryLoadingFailed: false
  //   })),
  //   on(BillingActions.loadPaymentHistoryFailed, state => ({
  //     ...state,
  //     paymentHistoryLoading      : false,
  //     paymentHistoryLoadingFailed: true
  //   }))
  // );
}
