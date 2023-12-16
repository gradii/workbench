import { createReducer, on } from '@ngrx/store';

import { BillingActions } from '@account-state/billing/billing.actions';
import { BillingInfo } from '@account-state/billing/billing-info.model';
import { Payment } from '@account-state/billing/payment.model';

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
    billingInfo: null,
    loadBillingInfo: false,
    loadBillingInfoFailed: false,

    updatePaymentMethodLoading: false,
    updatePaymentMethodFailed: false,

    deletePaymentMethodLoading: false,
    deletePaymentMethodFailed: false,

    changePlanLoading: false,
    changePlanFailed: false,
    changePlanSuccess: false,

    paymentHistory: [],
    paymentHistoryLoading: false,
    paymentHistoryLoadingFailed: false
  };

  export const reducer = createReducer(
    initialState,

    on(BillingActions.loadBillingInfo, state => ({ ...state, loadBillingInfo: true })),
    on(BillingActions.loadBillingInfoSuccess, (state, { billingInfo }) => ({
      ...state,
      billingInfo,
      loadBillingInfo: false
    })),
    on(BillingActions.loadBillingInfoFailed, state => ({
      ...state,
      loadBillingInfo: false,
      loadBillingInfoFailed: true
    })),

    on(BillingActions.updatePaymentMethod, state => ({ ...state, updatePaymentMethodLoading: true })),
    on(BillingActions.updatePaymentMethodSuccess, (state, { billingInfo }) => ({
      ...state,
      billingInfo,
      updatePaymentMethodLoading: false,
      updatePaymentMethodFailed: false
    })),
    on(BillingActions.updatePaymentMethodFailed, state => ({
      ...state,
      updatePaymentMethodLoading: false,
      updatePaymentMethodFailed: true
    })),
    on(BillingActions.clearUpdatePaymentMethodFailed, state => ({
      ...state,
      updatePaymentMethodFailed: false
    })),

    on(BillingActions.deletePaymentMethod, state => ({ ...state, deletePaymentMethodLoading: true })),
    on(BillingActions.deletePaymentMethodSuccess, (state, { billingInfo }) => ({
      ...state,
      billingInfo,
      deletePaymentMethodLoading: false,
      deletePaymentMethodFailed: false
    })),
    on(BillingActions.deletePaymentMethodFailed, state => ({
      ...state,
      deletePaymentMethodLoading: false,
      deletePaymentMethodFailed: true
    })),

    on(BillingActions.changePlanLoading, (state, { loading }) => ({
      ...state,
      changePlanLoading: loading
    })),
    on(BillingActions.changePlanFailed, state => ({
      ...state,
      changePlanFailed: true
    })),
    on(BillingActions.changePlanSuccess, state => ({
      ...state,
      changePlanSuccess: true
    })),

    on(BillingActions.loadPaymentHistory, state => ({
      ...state,
      paymentHistoryLoading: true
    })),
    on(BillingActions.loadPaymentHistorySuccess, (state, { paymentHistory }) => ({
      ...state,
      paymentHistory,
      paymentHistoryLoading: false,
      paymentHistoryLoadingFailed: false
    })),
    on(BillingActions.loadPaymentHistoryFailed, state => ({
      ...state,
      paymentHistoryLoading: false,
      paymentHistoryLoadingFailed: true
    }))
  );
}
