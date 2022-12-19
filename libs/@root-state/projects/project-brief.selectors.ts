import { select } from '@ngneat/elf';
import { fromProjectBrief } from './project-brief.reducer';

const getProjectBriefFeatureState = fromProjectBrief.fromProjectBriefStore;

export const getProjectBriefs = getProjectBriefFeatureState.pipe(select(
  (state: fromProjectBrief.State) => state.projects
));

export const getProjectsLoading = getProjectBriefFeatureState.pipe(select(
  (state: fromProjectBrief.State) => state.loading
));

export const getCreateProjectLoading = getProjectBriefFeatureState.pipe(select(
  (state: fromProjectBrief.State) => state.createLoading
));

export const getUpdateProjectLoading = getProjectBriefFeatureState.pipe(select(
  (state: fromProjectBrief.State) => state.updateLoading
));

export const getUpdateProjectFailed = getProjectBriefFeatureState.pipe(select(
  (state: fromProjectBrief.State) => state.updateFailed
));

export const getDeleteProjectLoading = getProjectBriefFeatureState.pipe(select(
  (state: fromProjectBrief.State) => state.deleteLoading
));
