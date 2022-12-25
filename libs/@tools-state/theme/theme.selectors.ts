import { select } from '@ngneat/elf';
import { selectAllEntities, selectEntities } from '@ngneat/elf-entities';
import { fromProjects } from '@tools-state/project/project.reducer';
import { getProjectFeatureState } from '@tools-state/project/project.selectors';
import { fromTheme } from '@tools-state/theme/theme.reducer';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export const getThemeState = fromTheme.fromThemeStore;

export const getThemeList = getThemeState.pipe(selectAllEntities());

export const getActiveTheme = combineLatest([getProjectFeatureState, getThemeState]).pipe(
  map(([projectState, themeState]: [fromProjects.State, fromTheme.State]) => themeState.entities[projectState.themeId])
);

export const getSupportLoading = getThemeState.pipe(select((state: fromTheme.State) => state.supportLoading));

export const getPaletteLoading = getThemeState.pipe(
  select((state: fromTheme.State) => state.supportLoading || state.shadesLoading)
);
