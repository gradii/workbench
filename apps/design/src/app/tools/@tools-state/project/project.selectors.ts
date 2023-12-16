import { createSelector } from '@ngrx/store';

import { fromProjects } from '@tools-state/project/project.reducer';
import { fromTools } from '@tools-state/tools.reducer';
import { getToolsState } from '@tools-state/tools.selector';
import { environment } from '../../../../environments/environment';

export const getProjectFeatureState = createSelector(getToolsState, (state: fromTools.State) => state.projects);

export const getActiveProjectId = createSelector(
  getProjectFeatureState,
  (state: fromProjects.State) => state.activeProjectId
);

export const getActiveProjectName = createSelector(getProjectFeatureState, (state: fromProjects.State) => state.name);

export const getShareLink = createSelector(getProjectFeatureState, (state: fromProjects.State) => {
  if (!state.shareId) {
    return null;
  }
  return `${environment.appServerName}/share/${state.shareId}`;
});

export const getShareLoading = createSelector(
  getProjectFeatureState,
  (state: fromProjects.State) => state.shareLoading
);

export const getTutorialId = createSelector(getProjectFeatureState, (state: fromProjects.State) => state.tutorialId);
