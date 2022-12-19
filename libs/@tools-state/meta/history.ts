import { createEffect } from '@ngneat/effects';
import { stateHistory } from '@ngneat/elf-state-history';
import { HistoryActions } from '@tools-state/history/history.actions';
import { fromTools } from '@tools-state/tools.reducer';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { tap } from 'rxjs/operators';
import { fromApp } from '@tools-state/app/app.reducer';
import { fromBreakpoint } from '@tools-state/breakpoint/breakpoint.reducer';
import { fromComponents } from '@tools-state/component/component.reducer';
import { fromActionDiagram } from '@tools-state/data/action-diagram/action-diagram.reducer';
import { fromActionFlow } from '@tools-state/data/action-flow/action-flow.reducer';
import { fromStoreItem } from '@tools-state/data/store-item/store-item.reducer';
import { fromWorkflow } from '@tools-state/data/workflow/workflow.reducer';
import { fromDownload } from '@tools-state/download/download.reducer';
import { fromHistory } from '@tools-state/history/history.reducer';
import { fromLayout } from '@tools-state/layout/layout.reducer';
import { fromPages } from '@tools-state/page/page.reducer';
import { fromProjects } from '@tools-state/project/project.reducer';
import { fromSettings } from '@tools-state/settings/settings.reducer';
import { fromSlots } from '@tools-state/slot/slot.reducer';
import { fromTheme } from '@tools-state/theme/theme.reducer';
import { fromWorkingArea } from '@tools-state/working-area/working-area.reducer';
import { fromFeatures } from '@tools-state/feature/feature.reducer';

let history: fromTools.State[] = [];
const historyMaxLength         = 20;

// Parts of the state which shouldn't affect history
const persistentState: string[] = ['breakpoint', 'tutorial', 'tutorialBrief', 'lesson', 'step'];

export function getWorkingAreaMode(timeIndex: number): WorkingAreaMode {
  return history[timeIndex]?.workingArea.mode;
}

export const todosStateHistory = stateHistory(fromApp.appStore);


export class MetaHistoryReducerEffect {
  clearState = createEffect((actions) => actions.pipe(
    tap((action) => {
      switch (action.type) {
        case HistoryActions.ActionTypes.Forward:
          return forward();
        case HistoryActions.ActionTypes.Back:
          return back();
        case HistoryActions.ActionTypes.Persist:
          return save();
      }
    })
  ), { dispatch: false });
}

// export function historyReducer(reducer: Reducer<fromTools.State>): ActionReducer<fromTools.State> {
//   return (state: fromTools.State, action: Action): fromTools.State => {
//     state = reducer(state, action);
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
//   };
// }

function buildHistory(): fromTools.State {
  return {
    app        : fromApp.appStore.getValue(),
    pages      : fromPages.fromPagesStore.getValue(),
    components : fromComponents.fromComponentsStore.getValue(),
    features   : fromFeatures.fromFeaturesStore.getValue(),
    slots      : fromSlots.fromSlotsStore.getValue(),
    // projects   : fromProjects.fromProjectsStore.getValue(),
    download   : fromDownload.fromDownloadStore.getValue(),
    workingArea: fromWorkingArea.fromWorkingAreaStore.getValue(),
    layout     : fromLayout.fromLayoutStore.getValue(),
    theme      : fromTheme.fromThemeStore.getValue(),
    // history: fromHistory.fromHistoryStore.getValue(),
    breakpoint   : fromBreakpoint.fromBreakpointStore.getValue(),
    actionDiagram: fromActionDiagram.fromActionDiagramStore.getValue(),
    actionFlow   : fromActionFlow.fromActionFlowStore.getValue(),
    workflow     : fromWorkflow.fromWorkflowStore.getValue(),
    storeItem    : fromStoreItem.fromStoreItemStore.getValue(),
    settings     : fromSettings.fromSettingsStore.getValue()
  };
}

function save() {
  const stateHistory = fromHistory.fromHistoryStore.getValue();
  if (stateHistory.timeIndex < history.length - 1) {
    history = history.slice(0, stateHistory.timeIndex + 1);
  }

  history.push(buildHistory());

  if (history.length > historyMaxLength) {
    history = history.slice(history.length - historyMaxLength, history.length);
  }

  fromHistory.fromHistoryStore.update(state => ({
    ...state,
    timeIndex: history.length - 1, historyLength: history.length
  }));
}

function forward() {
  const stateHistory = fromHistory.fromHistoryStore.getValue();
  let timeIndex      = stateHistory.timeIndex;

  if (timeIndex < history.length - 1) {
    timeIndex++;
    const state = createState(timeIndex);
    updateState(state);
  }
}

function back() {
  const stateHistory = fromHistory.fromHistoryStore.getValue();
  let timeIndex      = stateHistory.timeIndex;

  if (timeIndex > 0) {
    timeIndex--;
    const state = createState(timeIndex);
    updateState(state);
  }
}

function createState(timeIndex: number): fromTools.State {
  let previousState;
  const state: fromTools.State         = {} as fromTools.State;
  const newStateSlice: fromTools.State = history[timeIndex];
  const entries                        = Object.entries(newStateSlice);

  for (const [key, val] of entries) {
    if (persistentState.includes(key)) {
      state[key] = (previousState || (previousState = buildHistory()))[key];
    } else {
      state[key] = val;
    }
  }

  fromHistory.fromHistoryStore.update(state => ({
    ...state,
    timeIndex: timeIndex, historyLength: history.length
  }));

  return state;
}


function updateState(state: fromTools.State) {
  fromApp.appStore.update(() => (state.app));
  fromPages.fromPagesStore.update(() => (state.pages));
  fromComponents.fromComponentsStore.update(() => (state.components));
  fromSlots.fromSlotsStore.update(() => (state.slots));
  fromProjects.fromProjectsStore.update(() => (state.projects));
  fromDownload.fromDownloadStore.update(() => (state.download));
  fromWorkingArea.fromWorkingAreaStore.update(() => (state.workingArea));
  fromLayout.fromLayoutStore.update(() => (state.layout));
  fromTheme.fromThemeStore.update(() => (state.theme));
  // fromHistory.fromHistoryStore.update(() => (state.history));
  fromBreakpoint.fromBreakpointStore.update(() => (state.breakpoint));
  fromActionDiagram.fromActionDiagramStore.update(() => (state.actionDiagram));
  fromActionFlow.fromActionFlowStore.update(() => (state.actionFlow));
  fromWorkflow.fromWorkflowStore.update(() => (state.workflow));
  fromStoreItem.fromStoreItemStore.update(() => (state.storeItem));
  fromSettings.fromSettingsStore.update(() => (state.settings));
}