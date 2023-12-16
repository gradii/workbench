import { createFeatureSelector, createSelector } from '@ngrx/store';

import { fromProjectBrief } from './project-brief.reducer';

const getProjectBriefFeatureState = createFeatureSelector('projectBrief');

export const getProjectBriefs = createSelector(
  getProjectBriefFeatureState,
  (state: fromProjectBrief.State) => state.projects
);

export const getProjectsLoading = createSelector(
  getProjectBriefFeatureState,
  (state: fromProjectBrief.State) => state.loading
);

export const getCreateProjectLoading = createSelector(
  getProjectBriefFeatureState,
  (state: fromProjectBrief.State) => state.createLoading
);

export const getUpdateProjectLoading = createSelector(
  getProjectBriefFeatureState,
  (state: fromProjectBrief.State) => state.updateLoading
);

export const getUpdateProjectFailed = createSelector(
  getProjectBriefFeatureState,
  (state: fromProjectBrief.State) => state.updateFailed
);

export const getDeleteProjectLoading = createSelector(
  getProjectBriefFeatureState,
  (state: fromProjectBrief.State) => state.deleteLoading
);
