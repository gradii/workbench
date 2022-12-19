import { environment } from '@environments';
// import { validateAppropriateIndexOrder } from '@tools-state/meta/validate-appropriate-index-order';
import { MetaClearStateReducerEffect } from './clear-state';
import { MetaHistoryReducerEffect } from './history';


// historyReducer = createEffect((actions) => actions.pipe(
//   tap((action) => {
//     switch (action.type) {
//       case HistoryActions.ActionTypes.Forward:
//         return forward(state);
//       case HistoryActions.ActionTypes.Back:
//         return back(state);
//       case HistoryActions.ActionTypes.Persist:
//         return save(state);
//       default:
//         return state;
//     }
//   })
// ), { dispatch: false });

export const metaReducerEffect = [MetaClearStateReducerEffect, MetaHistoryReducerEffect];
// const reducers = [clearState, historyReducer];

// const devReducers = [validateAppropriateIndexOrder];

if (!environment.production) {
  // reducers.push(...devReducers);
}

// export const metaReducers: MetaReducer<fromTools.State>[] = reducers;
