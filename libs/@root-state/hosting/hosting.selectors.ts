import { select } from '@ngneat/elf';
import { selectAllEntities } from '@ngneat/elf-entities';

import { fromHosting } from '@root-state/hosting/hosting.reducer';

export const getHostingState = fromHosting.fromHostingStore;

export const getHostings = getHostingState.pipe(selectAllEntities());

export const getHostingProjectId = getHostingState.pipe(select((state: fromHosting.State) => state.projectId));

export const getHostingsLoading = getHostingState.pipe(select((state: fromHosting.State) => state.loading));

export const getHostingDeploymentLoading = getHostingState.pipe(
  select((state: fromHosting.State) => state.deploymentLoading
  ));

export const getCanUpdateInBackground = getHostingState.pipe(
  select((state: fromHosting.State) => state.canUpdateInBakground
  ));
