import { ActionReducerMap } from '@ngrx/store';

import { fromProjectBrief } from '@root-state/projects/project-brief.reducer';
import { fromProjectSettings } from './project-settings/project-settings.reducer';
import { fromHosting } from './hosting/hosting.reducer';
import { fromHostingView } from './hosting/hosting-view.reducer';

export namespace fromRoot {
  export abstract class State {
    projectBrief: fromProjectBrief.State;
    projectSettings: fromProjectSettings.State;
    hostings: fromHosting.State;
    hostingView: fromHostingView.State;
  }

  export const reducers: ActionReducerMap<State> = {
    projectBrief: fromProjectBrief.reducer,
    projectSettings: fromProjectSettings.reducer,
    hostings: fromHosting.reducer,
    hostingView: fromHostingView.reducer
  };
}
