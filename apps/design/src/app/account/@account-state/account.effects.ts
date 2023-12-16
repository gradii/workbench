import { ProfileEffects } from '@account-state/profile/profile.effects';
import { BillingEffects } from '@account-state/billing/billing.effects';
import { TemplateEffects } from '@account-state/template/template.effects';

export const AccountEffects = [ProfileEffects, BillingEffects, TemplateEffects];
