import { fromStoreItem } from '@tools-state/data/store-item/store-item.reducer';

import { fromWorkflow } from '@tools-state/data/workflow/workflow.reducer';
import { fromDownload } from '@tools-state/download/download.reducer';
import { fromHistory } from '@tools-state/history/history.reducer';
import { fromLayout } from '@tools-state/layout/layout.reducer';
import { fromProjects } from '@tools-state/project/project.reducer';
import { fromSettings } from '@tools-state/settings/settings.reducer';
import { fromTheme } from '@tools-state/theme/theme.reducer';
import { fromWorkingArea } from '@tools-state/working-area/working-area.reducer';
import { fromApp } from '@tools-state/app/app.reducer';
import { fromBreakpoint } from '@tools-state/breakpoint/breakpoint.reducer';
import { fromComponents } from '@tools-state/component/component.reducer';
import { fromActionDiagram } from '@tools-state/data/action-diagram/action-diagram.reducer';
import { fromActionFlow } from '@tools-state/data/action-flow/action-flow.reducer';
import { fromPages } from '@tools-state/page/page.reducer';
import { fromSlots } from '@tools-state/slot/slot.reducer';
import { fromFeatures } from './feature/feature.reducer';
// import { metaReducers } from './meta/meta-reducers';

export namespace fromTools {
  // export const storeConfig = { metaReducers };

  export interface State {
    app: fromApp.State;
    pages: fromPages.State;
    components: fromComponents.State;
    features: fromFeatures.State;
    slots: fromSlots.State;
    projects?: fromProjects.State;
    download: fromDownload.State;
    workingArea: fromWorkingArea.State;
    layout: fromLayout.State;
    theme: fromTheme.State;
    // history: fromHistory.State;
    breakpoint: fromBreakpoint.State;
    actionDiagram: fromActionDiagram.State;
    actionFlow: fromActionFlow.State;
    workflow: fromWorkflow.State;
    storeItem: fromStoreItem.State;
    // tutorialBrief: fromTutorialBrief.State;
    // tutorial: fromTutorial.State;
    // lesson: fromLesson.State;
    // step: fromStep.State;
    settings: fromSettings.State;
  }

  export const reducerEffects = [
    fromApp.ReducerEffect,
    fromPages.ReducerEffect,
    fromComponents.ReducerEffect,
    fromFeatures.ReducerEffect,
    fromSlots.ReducerEffect,
    fromProjects.ReducerEffect,
    fromDownload.ReducerEffect,
    fromWorkingArea.ReducerEffect,
    fromLayout.ReducerEffect,
    fromTheme.ReducerEffect,
    fromHistory.ReducerEffect,
    fromBreakpoint.ReducerEffect,
    fromActionDiagram.ReducerEffect,
    fromActionFlow.ReducerEffect,
    fromWorkflow.ReducerEffect,
    fromStoreItem.ReducerEffect,
    // // tutorialBrief: fromTutorialBrief.reducer,
    // // tutorial: fromTutorial.reducer,
    // // lesson: fromLesson.reducer,
    // // step: fromStep.reducer,
    fromSettings.ReducerEffect
  ];
}
