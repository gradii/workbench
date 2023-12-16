import { createSelector, createFeatureSelector } from '@ngrx/store';

import { fromHosting } from '@root-state/hosting/hosting.reducer';

export const getHostingState = createFeatureSelector('hostings');

export const getHostings = createSelector(getHostingState, fromHosting.selectAll);

export const getHostingProjectId = createSelector(getHostingState, (state: fromHosting.State) => state.projectId);

export const getHostingsLoading = createSelector(getHostingState, (state: fromHosting.State) => state.loading);

export const getHostingDeploymentLoading = createSelector(
  getHostingState,
  (state: fromHosting.State) => state.deploymentLoading
);

export const getCanUpdateInBackground = createSelector(
  getHostingState,
  (state: fromHosting.State) => state.canUpdateInBakground
);
