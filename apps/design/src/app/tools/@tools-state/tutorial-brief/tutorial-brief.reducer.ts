import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { TutorialBrief } from './tutorial-brief.model';
import { TutorialBriefActions } from '@tools-state/tutorial-brief/tutorial-brief.actions';

export namespace fromTutorialBrief {
  export interface State extends EntityState<TutorialBrief> {
    selectedTutorialId: string;
    loading: boolean;
  }

  const adapter: EntityAdapter<TutorialBrief> = createEntityAdapter<TutorialBrief>({
    selectId: (tutorial: TutorialBrief) => tutorial.id
  });

  const initialState: State = adapter.getInitialState({
    selectedTutorialId: null,
    loading: false
  });

  export const reducer = createReducer(
    initialState,
    on(TutorialBriefActions.setLoading, (state, { loading }) => {
      return { ...state, loading };
    }),
    on(TutorialBriefActions.setTutorials, (state, { tutorials }) => {
      const selectedTutorialId = tutorials.length ? tutorials[0].id : null;
      return adapter.setAll(tutorials, { ...state, selectedTutorialId });
    }),
    on(TutorialBriefActions.selectTutorial, (state, { tutorialId }) => {
      return { ...state, selectedTutorialId: tutorialId };
    })
  );

  export const { selectAll, selectEntities } = adapter.getSelectors();
}
