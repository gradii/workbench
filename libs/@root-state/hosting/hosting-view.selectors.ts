import { selectEntities } from '@ngneat/elf-entities';

import { fromHostingView } from '@root-state/hosting/hosting-view.reducer';

export const getHostingViewState = fromHostingView.fromHostingStore;
export const getHostingViewEntities = getHostingViewState.pipe(selectEntities());
