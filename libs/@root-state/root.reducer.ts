import { fromProjectBrief } from '@root-state/projects/project-brief.reducer';
import { fromHostingView } from './hosting/hosting-view.reducer';
import { fromHosting } from './hosting/hosting.reducer';
import { fromProjectSettings } from './project-settings/project-settings.reducer';

export namespace fromRoot {
  export abstract class State {
    projectBrief: fromProjectBrief.State;
    projectSettings: fromProjectSettings.State;
    hostings: fromHosting.State;
    hostingView: fromHostingView.State;
  }

  export const ReducerEffects = [
    fromProjectBrief.ReducerEffect,
    fromProjectSettings.ReducerEffect,
    fromHosting.ReducerEffect,
    fromHostingView.ReducerEffect,
  ];

  // export const reducers: ActionReducerMap<State> = {
  //   projectBrief: fromProjectBrief.reducer,
  //   projectSettings: fromProjectSettings.reducer,
  //   hostings: fromHosting.reducer,
  //   hostingView: fromHostingView.reducer
  // };
}
