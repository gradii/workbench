import { BillingInfo } from '@account-state/billing/billing-info.model';
import { Payment } from '@account-state/billing/payment.model';
import { createAction } from '@ngneat/effects';
import { Card } from '@workbench-interfaces';

export namespace BillingActions {
  export enum ActionTypes {
    LoadBillingInfo                = '[Billing] Load Billing Info',
    LoadBillingInfoSuccess         = '[Billing] Load Billing Info Success',
    LoadBillingInfoFailed          = '[Billing] Load Billing Info Failed',

    UpdatePaymentMethod            = '[Billing] Update Payment Method',
    UpdatePaymentMethodSuccess     = '[Billing] Update Payment Method Success',
    UpdatePaymentMethodFailed      = '[Billing] Update Payment Method Failed',
    ClearUpdatePaymentMethodFailed = '[Billing] Clear Update Payment Method Failed',

    DeletePaymentMethod            = '[Billing] Delete Payment Method',
    DeletePaymentMethodSuccess     = '[Billing] Delete Payment Method Success',
    DeletePaymentMethodFailed      = '[Billing] Delete Payment Method Failed',
    ClearDeletePaymentMethodFailed = '[Billing] Clear Delete Payment Method Failed',

    ChangePlanLoading              = '[Billing] Change Plan Loading',
    ChangePlanFailed               = '[Billing] Change Plan Failed',
    ChangePlanSuccess              = '[Billing] Change Plan Success',

    RetryChangePlanLoading         = '[Billing] RetryChange Plan',

    LoadPaymentHistory             = '[Payment History] Load Payment History',
    LoadPaymentHistorySuccess      = '[Payment History] Load Payment History Success',
    LoadPaymentHistoryFailed       = '[Payment History] Load Payment History Failed',
  }

  export const LoadBillingInfo        = createAction(ActionTypes.LoadBillingInfo);
  export const LoadBillingInfoFailed  = createAction(ActionTypes.LoadBillingInfoFailed);
  export const LoadBillingInfoSuccess = createAction(
    ActionTypes.LoadBillingInfoSuccess,
    (billingInfo: BillingInfo) => ({ billingInfo })
  );

  export const UpdatePaymentMethod        = createAction(ActionTypes.UpdatePaymentMethod,
    (card: Card) => ({ card }));
  export const UpdatePaymentMethodSuccess     = createAction(
    ActionTypes.UpdatePaymentMethodSuccess,
    (billingInfo: BillingInfo) => ({ billingInfo })
  );
  export const UpdatePaymentMethodFailed      = createAction(ActionTypes.UpdatePaymentMethodFailed);
  export const ClearUpdatePaymentMethodFailed = createAction(ActionTypes.ClearUpdatePaymentMethodFailed);

  export const DeletePaymentMethod        = createAction(ActionTypes.DeletePaymentMethod);
  export const DeletePaymentMethodSuccess     = createAction(
    ActionTypes.DeletePaymentMethodSuccess,
    (billingInfo: BillingInfo) => ({ billingInfo })
  );
  export const DeletePaymentMethodFailed      = createAction(ActionTypes.DeletePaymentMethodFailed);
  export const ClearDeletePaymentMethodFailed = createAction(ActionTypes.ClearDeletePaymentMethodFailed);

  export const ChangePlanLoading = createAction(ActionTypes.ChangePlanLoading, (loading: boolean) => ({ loading }));
  export const ChangePlanFailed  = createAction(ActionTypes.ChangePlanFailed);
  export const ChangePlanSuccess = createAction(ActionTypes.ChangePlanSuccess);

  export const RetryChangePlanLoading = createAction(ActionTypes.RetryChangePlanLoading,
    (loading: boolean) => ({ loading }));

  export const LoadPaymentHistory        = createAction(ActionTypes.LoadPaymentHistory);
  export const LoadPaymentHistorySuccess = createAction(
    ActionTypes.LoadPaymentHistorySuccess,
    (paymentHistory: Payment[]) => ({ paymentHistory })
  );
  export const LoadPaymentHistoryFailed  = createAction(ActionTypes.LoadPaymentHistoryFailed);
}
