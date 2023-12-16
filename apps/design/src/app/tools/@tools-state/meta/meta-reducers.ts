import { MetaReducer } from '@ngrx/store';

import { historyReducer } from '@tools-state/meta/history';
import { clearState } from '@tools-state/meta/clear-state';
import { fromTools } from '@tools-state/tools.reducer';
import { validateAppropriateIndexOrder } from '@tools-state/meta/validate-appropriate-index-order';
import { environment } from '../../../../environments/environment';

const reducers = [clearState, historyReducer];

const devReducers = [validateAppropriateIndexOrder];

if (!environment.production) {
  reducers.push(...devReducers);
}

export const metaReducers: MetaReducer<fromTools.State>[] = reducers;
