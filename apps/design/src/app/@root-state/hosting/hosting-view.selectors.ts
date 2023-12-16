import { createSelector, createFeatureSelector } from '@ngrx/store';

import { fromHostingView } from '@root-state/hosting/hosting-view.reducer';

export const getHostingViewState = createFeatureSelector('hostingView');
export const getHostingViewEntities = createSelector(getHostingViewState, fromHostingView.selectEntities);
