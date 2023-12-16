export enum SubscriptionStatus {
  NOT_SUBSCRIBED = 'NOT_SUBSCRIBED',
  ACTIVE = 'ACTIVE',
  INCOMPLETE = 'INCOMPLETE',
  WILL_BE_CANCELLED = 'WILL_BE_CANCELLED',
}

export interface BillingInfo {
  cardLast4: string;
  cardBrand: string;
  cardExpirationMonth: number;
  cardExpirationYear: number;
  subscriptionExpiryDate: Date;
  paymentMethodAttached: boolean;
  hadBilling: boolean;
  subscriptionStatus: SubscriptionStatus;
}
