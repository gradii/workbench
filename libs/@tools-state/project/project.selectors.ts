import { environment } from '@environments';
import { select } from '@ngneat/elf';

import { fromProjects } from '@tools-state/project/project.reducer';

export const getProjectFeatureState = fromProjects.fromProjectsStore;

export const getActiveProjectId = getProjectFeatureState.pipe(
  select((state: fromProjects.State) => state.activeProjectId)
);

export const getActiveProjectName = getProjectFeatureState.pipe(select((state: fromProjects.State) => state.name));

export const getShareLink = getProjectFeatureState.pipe(select((state: fromProjects.State) => {
  if (!state.shareId) {
    return null;
  }
  return `${environment.appServerName}/share/${state.shareId}`;
}));

export const getShareLoading = getProjectFeatureState.pipe(select(
  (state: fromProjects.State) => state.shareLoading
));

export const getTutorialId = getProjectFeatureState.pipe(select((state: fromProjects.State) => state.tutorialId));
