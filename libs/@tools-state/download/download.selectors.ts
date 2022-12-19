import { select } from '@ngneat/elf';

import { fromDownload } from '@tools-state/download/download.reducer';

const getDownloadFeatureState = fromDownload.fromDownloadStore;

export const getLoading = getDownloadFeatureState.pipe(select((state: fromDownload.State) => state.loading));
export const getErrored = getDownloadFeatureState.pipe(select((state: fromDownload.State) => state.errored));
export const getSuccess = getDownloadFeatureState.pipe(select((state: fromDownload.State) => state.success));
