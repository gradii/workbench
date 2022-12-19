import { environment } from '@environments';
// import { clearStore } from '@root-state/meta/clear-store';

const reducers = [/*clearStore*/];

const devReducers = [/*logger*/];

if (!environment.production) {
  reducers.push(...devReducers);
}

// export const rootMetaReducers: MetaReducer<fromRoot.State>[] = reducers;
