import { BillingInfo, SubscriptionStatus } from '@account-state/billing/billing-info.model';
import { fromBilling } from '@account-state/billing/billing.reducer';
import { select } from '@ngneat/elf';

export const selectBillingState = fromBilling.fromBillingStore;

export const selectBillingInfo                = selectBillingState.pipe(
  select((state: fromBilling.State) => state.billingInfo));
export const selectHasPaymentMethod           = selectBillingInfo.pipe(
  select((billingInfo: BillingInfo) => !!billingInfo && !!billingInfo.cardLast4));
export const selectHadBilling                 = selectBillingInfo.pipe(
  select((billingInfo: BillingInfo) => !!billingInfo && billingInfo.hadBilling));
export const selectWillBeCancelled            = selectBillingInfo.pipe(
  select((billingInfo: BillingInfo) =>
    !!billingInfo && billingInfo.subscriptionStatus === SubscriptionStatus.WILL_BE_CANCELLED));
export const selectSubscriptionExpiryDate     = selectBillingInfo.pipe(
  select((billingInfo: BillingInfo) => {
    return !!billingInfo && billingInfo.subscriptionExpiryDate && new Date(billingInfo.subscriptionExpiryDate);
  }));
export const selectLoadBillingInfo            = selectBillingState.pipe(
  select((state: fromBilling.State) => state.loadBillingInfo));
export const selectLoadBillingInfoFailed      = selectBillingState.pipe(
  select((state: fromBilling.State) => state.loadBillingInfoFailed));
export const selectUpdatePaymentMethodLoading = selectBillingState.pipe(
  select((state: fromBilling.State) => state.updatePaymentMethodLoading));
export const selectUpdatePaymentMethodFailed  = selectBillingState.pipe(
  select((state: fromBilling.State) => state.updatePaymentMethodFailed));
export const selectUpdatePaymentMethodSuccess = selectBillingState.pipe(
  select((state: fromBilling.State) => !state.updatePaymentMethodFailed));
export const selectDeletePaymentMethodLoading = selectBillingState.pipe(
  select((state: fromBilling.State) => state.deletePaymentMethodLoading));
export const selectDeletePaymentMethodFailed  = selectBillingState.pipe(
  select((state: fromBilling.State) => state.deletePaymentMethodFailed));
export const selectDeletePaymentMethodSuccess = selectBillingState.pipe(
  select((state: fromBilling.State) => !state.deletePaymentMethodFailed));
export const selectChangePlanLoading          = selectBillingState.pipe(
  select((state: fromBilling.State) => state.changePlanLoading));
export const selectPaymentHistory             = selectBillingState.pipe(
  select((state: fromBilling.State) => state.paymentHistory));
export const selectPaymentHistoryLoading      = selectBillingState.pipe(
  select((state: fromBilling.State) => state.paymentHistoryLoading));
