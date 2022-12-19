// import { fromTools } from '@tools-state/tools.reducer';
import { ComponentActions } from '@tools-state/component/component.actions';

const ignoredActions: string[] = [ComponentActions.ActionTypes.HoveredComponent];

// export function logger(reducer: ActionReducer<fromTools.State>): ActionReducer<fromTools.State> {
//   return (state: fromTools.State, action: Action): fromTools.State => {
//     const result = reducer(state, action);
//
//     if (!ignoredActions.includes(action.type)) {
//       console.groupCollapsed(action.type);
//       console.info('prev state', state);
//       console.info('action', action);
//       console.info('next state', result);
//       console.groupEnd();
//     }
//
//     return result;
//   };
// }
