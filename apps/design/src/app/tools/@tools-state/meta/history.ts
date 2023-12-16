import { Action, ActionReducer } from '@ngrx/store';

import { HistoryActions } from '@tools-state/history/history.actions';
import { fromTools } from '@tools-state/tools.reducer';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';

let history: fromTools.State[] = [];
const historyMaxLength = 20;

// Parts of the state which shouldn't affect history
const persistentState: string[] = ['breakpoint', 'tutorial', 'tutorialBrief', 'lesson', 'step'];

export function getWorkingAreaMode(timeIndex: number): WorkingAreaMode {
  return history[timeIndex]?.workingArea.mode;
}

export function historyReducer(reducer: ActionReducer<fromTools.State>): ActionReducer<fromTools.State> {
  return (state: fromTools.State, action: Action): fromTools.State => {
    state = reducer(state, action);
    switch (action.type) {
      case HistoryActions.ActionTypes.Forward:
        return forward(state);
      case HistoryActions.ActionTypes.Back:
        return back(state);
      case HistoryActions.ActionTypes.Persist:
        return save(state);
      default:
        return state;
    }
  };
}

function save(state: fromTools.State): fromTools.State {
  if (state.history.timeIndex < history.length - 1) {
    history = history.slice(0, state.history.timeIndex + 1);
  }

  history.push(state);

  if (history.length > historyMaxLength) {
    history = history.slice(history.length - historyMaxLength, history.length);
  }

  return {
    ...state,
    history: { timeIndex: history.length - 1, historyLength: history.length }
  };
}

function forward(state: fromTools.State): fromTools.State {
  let timeIndex = state.history.timeIndex;

  if (timeIndex < history.length - 1) {
    timeIndex++;
    state = createState(state, timeIndex);
  }

  return state;
}

function back(state: fromTools.State): fromTools.State {
  let timeIndex = state.history.timeIndex;

  if (timeIndex > 0) {
    timeIndex--;
    state = createState(state, timeIndex);
  }

  return state;
}

function createState(previousState: fromTools.State, timeIndex: number): fromTools.State {
  const state: fromTools.State = {} as fromTools.State;
  const newStateSlice: fromTools.State = history[timeIndex];
  const entries = Object.entries(newStateSlice);

  for (const [key, val] of entries) {
    if (persistentState.includes(key)) {
      state[key] = previousState[key];
    } else {
      state[key] = val;
    }
  }

  state.history = { timeIndex, historyLength: history.length };

  return state;
}
