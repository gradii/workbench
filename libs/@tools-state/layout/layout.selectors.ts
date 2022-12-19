import { select } from '@ngneat/elf';
import { fromLayout } from '@tools-state/layout/layout.reducer';

export const getLayoutFeatureState = fromLayout.fromLayoutStore;

export const getLayout = getLayoutFeatureState.pipe(select((state: fromLayout.State) => state.layout));
