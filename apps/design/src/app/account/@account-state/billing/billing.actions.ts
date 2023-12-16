import { createAction, props } from '@ngrx/store';

import { BillingInfo } from '@account-state/billing/billing-info.model';
import { Payment } from '@account-state/billing/payment.model';
import { Card } from '../../billing/services/stripe-provider.service';

export namespace BillingActions {
  export enum ActionTypes {
    LoadBillingInfo = '[Billing] Load Billing Info',
    LoadBillingInfoFailed = '[Billing] Load Billing Info Failed',
    LoadBillingInfoSuccess = '[Billing] Load Billing Info Success',

    UpdatePaymentMethod = '[Billing] Update Payment Method',
    UpdatePaymentMethodSuccess = '[Billing] Update Payment Method Success',
    UpdatePaymentMethodFailed = '[Billing] Update Payment Method Failed',
    ClearUpdatePaymentMethodFailed = '[Billing] Clear Update Payment Method Failed',

    DeletePaymentMethod = '[Billing] Delete Payment Method',
    DeletePaymentMethodSuccess = '[Billing] Delete Payment Method Success',
    DeletePaymentMethodFailed = '[Billing] Delete Payment Method Failed',
    ClearDeletePaymentMethodFailed = '[Billing] Clear Delete Payment Method Failed',

    ChangePlanLoading = '[Billing] Change Plan Loading',
    ChangePlanFailed = '[Billing] Change Plan Failed',
    ChangePlanSuccess = '[Billing] Change Plan Success',

    RetryChangePlanLoading = '[Billing] RetryChange Plan',

    LoadPaymentHistory = '[Payment History] Load Payment History',
    LoadPaymentHistorySuccess = '[Payment History] Load Payment History Success',
    LoadPaymentHistoryFailed = '[Payment History] Load Payment History Failed',
  }

  export const loadBillingInfo = createAction(ActionTypes.LoadBillingInfo);
  export const loadBillingInfoFailed = createAction(ActionTypes.LoadBillingInfoFailed);
  export const loadBillingInfoSuccess = createAction(
    ActionTypes.LoadBillingInfoSuccess,
    props<{ billingInfo: BillingInfo }>()
  );

  export const updatePaymentMethod = createAction(ActionTypes.UpdatePaymentMethod, props<{ card: Card }>());
  export const updatePaymentMethodSuccess = createAction(
    ActionTypes.UpdatePaymentMethodSuccess,
    props<{ billingInfo: BillingInfo }>()
  );
  export const updatePaymentMethodFailed = createAction(ActionTypes.UpdatePaymentMethodFailed);
  export const clearUpdatePaymentMethodFailed = createAction(ActionTypes.ClearUpdatePaymentMethodFailed);

  export const deletePaymentMethod = createAction(ActionTypes.DeletePaymentMethod);
  export const deletePaymentMethodSuccess = createAction(
    ActionTypes.DeletePaymentMethodSuccess,
    props<{ billingInfo: BillingInfo }>()
  );
  export const deletePaymentMethodFailed = createAction(ActionTypes.DeletePaymentMethodFailed);
  export const clearDeletePaymentMethodFailed = createAction(ActionTypes.ClearDeletePaymentMethodFailed);

  export const changePlanLoading = createAction(ActionTypes.ChangePlanLoading, props<{ loading: boolean }>());
  export const changePlanFailed = createAction(ActionTypes.ChangePlanFailed);
  export const changePlanSuccess = createAction(ActionTypes.ChangePlanSuccess);

  export const retryChangePlanLoading = createAction(ActionTypes.RetryChangePlanLoading, props<{ loading: boolean }>());

  export const loadPaymentHistory = createAction(ActionTypes.LoadPaymentHistory);
  export const loadPaymentHistorySuccess = createAction(
    ActionTypes.LoadPaymentHistorySuccess,
    props<{ paymentHistory: Payment[] }>()
  );
  export const loadPaymentHistoryFailed = createAction(ActionTypes.LoadPaymentHistoryFailed);
}
