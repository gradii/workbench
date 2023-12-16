import { ActionReducerMap } from '@ngrx/store';
import { fromStoreItem } from '@tools-state/data/store-item/store-item.reducer';

import { fromWorkflow } from '@tools-state/data/workflow/workflow.reducer';
import { fromDownload } from '@tools-state/download/download.reducer';
import { fromLayout } from '@tools-state/layout/layout.reducer';
import { fromHistory } from '@tools-state/history/history.reducer';
import { fromProjects } from '@tools-state/project/project.reducer';
import { fromTheme } from '@tools-state/theme/theme.reducer';
import { fromWorkingArea } from '@tools-state/working-area/working-area.reducer';
import { metaReducers } from './meta/meta-reducers';
import { fromComponents } from './component/component.reducer';
import { fromPages } from './page/page.reducer';
import { fromSlots } from './slot/slot.reducer';
import { fromBreakpoint } from './breakpoint/breakpoint.reducer';
import { fromTutorialBrief } from '@tools-state/tutorial-brief/tutorial-brief.reducer';
import { fromLesson } from '@tools-state/tutorial-lesson/lesson.reducer';
import { fromStep } from '@tools-state/tutorial-step/step.reducer';
import { fromTutorial } from '@tools-state/tutorial/tutorial.reducer';
import { fromSettings } from '@tools-state/settings/settings.reducer';
import { fromApp } from './app/app.reducer';

export namespace fromTools {
  export const storeConfig = { metaReducers };

  export interface State {
    app: fromApp.State;
    pages: fromPages.State;
    components: fromComponents.State;
    slots: fromSlots.State;
    projects: fromProjects.State;
    download: fromDownload.State;
    workingArea: fromWorkingArea.State;
    layout: fromLayout.State;
    theme: fromTheme.State;
    history: fromHistory.State;
    breakpoint: fromBreakpoint.State;
    workflow: fromWorkflow.State;
    storeItem: fromStoreItem.State;
    tutorialBrief: fromTutorialBrief.State;
    tutorial: fromTutorial.State;
    lesson: fromLesson.State;
    step: fromStep.State;
    settings: fromSettings.State;
  }

  export const reducers: ActionReducerMap<State> = {
    app: fromApp.reducer,
    pages: fromPages.reducer,
    components: fromComponents.reducer,
    slots: fromSlots.reducer,
    projects: fromProjects.reducer,
    download: fromDownload.reducer,
    workingArea: fromWorkingArea.reducer,
    layout: fromLayout.reducer,
    theme: fromTheme.reducer,
    history: fromHistory.reducer,
    breakpoint: fromBreakpoint.reducer,
    workflow: fromWorkflow.reducer,
    storeItem: fromStoreItem.reducer,
    tutorialBrief: fromTutorialBrief.reducer,
    tutorial: fromTutorial.reducer,
    lesson: fromLesson.reducer,
    step: fromStep.reducer,
    settings: fromSettings.reducer
  };
}
