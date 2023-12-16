import { createFeatureSelector } from '@ngrx/store';

import { fromAccount } from './account.reducer';

export const getAccountState = createFeatureSelector<fromAccount.State>('account');
