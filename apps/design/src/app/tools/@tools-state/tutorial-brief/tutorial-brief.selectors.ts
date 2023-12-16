import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';

import { fromTutorialBrief } from './tutorial-brief.reducer';
import { getToolsState } from '@tools-state/tools.selector';
import { fromTools } from '@tools-state/tools.reducer';
import { TutorialBrief } from './tutorial-brief.model';

export const getTutorialBriefState = createSelector(getToolsState, (state: fromTools.State) => state.tutorialBrief);
export const getTutorialBriefs = createSelector(getTutorialBriefState, fromTutorialBrief.selectAll);
export const getTutorialBriefEntities = createSelector(getTutorialBriefState, fromTutorialBrief.selectEntities);

export const getSelectedTutorialBriefId = createSelector(
  getTutorialBriefState,
  (state: fromTutorialBrief.State) => state.selectedTutorialId
);

export const getSelectedTutorialBrief = createSelector(
  getTutorialBriefEntities,
  getSelectedTutorialBriefId,
  (tutorials: Dictionary<TutorialBrief>, selectedTutorialId: string) => tutorials[selectedTutorialId]
);

export const getTutorialBriefLoading = createSelector(
  getTutorialBriefState,
  (state: fromTutorialBrief.State) => state.loading
);
