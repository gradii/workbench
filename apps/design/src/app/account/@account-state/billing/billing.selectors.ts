import { createSelector } from '@ngrx/store';

import { getAccountState } from '@account-state/account.selector';
import { fromAccount } from '@account-state/account.reducer';
import { fromBilling } from '@account-state/billing/billing.reducer';
import { BillingInfo, SubscriptionStatus } from '@account-state/billing/billing-info.model';

export const selectBillingState = createSelector(getAccountState, (state: fromAccount.State) => state.billing);

export const selectBillingInfo = createSelector(selectBillingState, (state: fromBilling.State) => state.billingInfo);
export const selectHasPaymentMethod = createSelector(
  selectBillingInfo,
  (billingInfo: BillingInfo) => !!billingInfo && !!billingInfo.cardLast4
);
export const selectHadBilling = createSelector(
  selectBillingInfo,
  (billingInfo: BillingInfo) => !!billingInfo && billingInfo.hadBilling
);
export const selectWillBeCancelled = createSelector(
  selectBillingInfo,
  (billingInfo: BillingInfo) =>
    !!billingInfo && billingInfo.subscriptionStatus === SubscriptionStatus.WILL_BE_CANCELLED
);
export const selectSubscriptionExpiryDate = createSelector(selectBillingInfo, (billingInfo: BillingInfo) => {
  return !!billingInfo && billingInfo.subscriptionExpiryDate && new Date(billingInfo.subscriptionExpiryDate);
});

export const selectLoadBillingInfo = createSelector(
  selectBillingState,
  (state: fromBilling.State) => state.loadBillingInfo
);
export const selectLoadBillingInfoFailed = createSelector(
  selectBillingState,
  (state: fromBilling.State) => state.loadBillingInfoFailed
);

export const selectUpdatePaymentMethodLoading = createSelector(
  selectBillingState,
  (state: fromBilling.State) => state.updatePaymentMethodLoading
);
export const selectUpdatePaymentMethodFailed = createSelector(
  selectBillingState,
  (state: fromBilling.State) => state.updatePaymentMethodFailed
);
export const selectUpdatePaymentMethodSuccess = createSelector(
  selectBillingState,
  (state: fromBilling.State) => !state.updatePaymentMethodFailed
);

export const selectDeletePaymentMethodLoading = createSelector(
  selectBillingState,
  (state: fromBilling.State) => state.deletePaymentMethodLoading
);
export const selectDeletePaymentMethodFailed = createSelector(
  selectBillingState,
  (state: fromBilling.State) => state.deletePaymentMethodFailed
);
export const selectDeletePaymentMethodSuccess = createSelector(
  selectBillingState,
  (state: fromBilling.State) => !state.deletePaymentMethodFailed
);

export const selectChangePlanLoading = createSelector(
  selectBillingState,
  (state: fromBilling.State) => state.changePlanLoading
);

export const selectPaymentHistory = createSelector(
  selectBillingState,
  (state: fromBilling.State) => state.paymentHistory
);
export const selectPaymentHistoryLoading = createSelector(
  selectBillingState,
  (state: fromBilling.State) => state.paymentHistoryLoading
);
