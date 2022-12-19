import { select } from '@ngneat/elf';

import { fromWorkingArea } from '@tools-state/working-area/working-area.reducer';

const getWorkingAreaFeatureState = fromWorkingArea.fromWorkingAreaStore;

export const getWorkingAreaMode = getWorkingAreaFeatureState.pipe(
  select((state: fromWorkingArea.State) => state.mode)
);

export const getWorkingAreaWorkflowMode = getWorkingAreaFeatureState.pipe(
  select((state: fromWorkingArea.State) => state.workflowMode)
);

export const getKitchenApp = getWorkingAreaFeatureState.pipe(select((state: fromWorkingArea.State) => state.app));
