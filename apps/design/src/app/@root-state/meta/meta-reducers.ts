import { MetaReducer } from '@ngrx/store';

import { environment } from '../../../environments/environment';
import { fromRoot } from '@root-state/root.reducer';
import { logger } from '@root-state/meta/logger';
import { clearStore } from '@root-state/meta/clear-store';

const reducers = [clearStore];

const devReducers = [logger];

if (!environment.production) {
  reducers.push(...devReducers);
}

export const rootMetaReducers: MetaReducer<fromRoot.State>[] = reducers;
