import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Step } from '../tutorial-brief/tutorial-brief.model';
import { StepActions } from '@tools-state/tutorial-step/step.actions';

export namespace fromStep {
  export interface State extends EntityState<Step> {
    activeStepIndex: number;
  }

  const adapter: EntityAdapter<Step> = createEntityAdapter<Step>({
    selectId: (step: Step) => step.id
  });

  const initialState: State = adapter.getInitialState({
    activeStepIndex: 0
  });

  export const reducer = createReducer(
    initialState,
    on(StepActions.setSteps, (state: State, { steps }) => {
      return adapter.setAll(steps, state);
    }),
    on(StepActions.setActiveStep, (state: State, { activeStepIndex }) => {
      return { ...state, activeStepIndex };
    })
  );

  export const { selectAll } = adapter.getSelectors();
}
