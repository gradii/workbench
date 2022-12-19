// import { fromTools } from '@tools-state/tools.reducer';
// import { AppActions } from '@tools-state/app/app.actions';

import { createEffect } from '@ngneat/effects';
import { tap } from 'rxjs/operators';
import { AppActions } from '../app/app.actions';
import { fromApp } from '../app/app.reducer';
import { fromBreakpoint } from '../breakpoint/breakpoint.reducer';
import { fromComponents } from '../component/component.reducer';
import { fromStoreItem } from '../data/store-item/store-item.reducer';
import { fromWorkflow } from '../data/workflow/workflow.reducer';
import { fromDownload } from '../download/download.reducer';
import { fromHistory } from '../history/history.reducer';
import { fromLayout } from '../layout/layout.reducer';
import { fromPages } from '../page/page.reducer';
import { fromProjects } from '../project/project.reducer';
import { fromSettings } from '../settings/settings.reducer';
import { fromSlots } from '../slot/slot.reducer';
import { fromTheme } from '../theme/theme.reducer';
import { fromWorkingArea } from '../working-area/working-area.reducer';

export class MetaClearStateReducerEffect {
  clearState = createEffect((actions) => actions.pipe(
    tap((action) => {
      switch (action.type) {
        case AppActions.ActionTypes.ClearAppState:
          fromApp.appStore.reset();
          fromPages.fromPagesStore.reset();
          fromComponents.fromComponentsStore.reset();
          fromSlots.fromSlotsStore.reset();
          fromProjects.fromProjectsStore.reset();
          fromDownload.fromDownloadStore.reset();
          fromWorkingArea.fromWorkingAreaStore.reset();
          fromLayout.fromLayoutStore.reset();
          fromTheme.fromThemeStore.reset();
          fromHistory.fromHistoryStore.reset();
          fromBreakpoint.fromBreakpointStore.reset();
          fromWorkflow.fromWorkflowStore.reset();
          fromStoreItem.fromStoreItemStore.reset();
          fromSettings.fromSettingsStore.reset();
          break;
      }
    })
  ), { dispatch: false });
}

// export function clearState(reducer: ActionReducer<fromTools.State>): ActionReducer<fromTools.State> {
//   return (state: fromTools.State, action: Action): fromTools.State => {
//     if (action.type === AppActions.ActionTypes.ClearAppState) {
//       state = undefined;
//     }
//     return reducer(state, action);
//   };
// }
