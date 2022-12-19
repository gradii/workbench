import { fromTemplate } from '@account-state/template/template.reducer';
import { select } from '@ngneat/elf';

export const selectTemplateState = fromTemplate.fromTemplateStore;

export const selectTemplateList = selectTemplateState.pipe(select((state: fromTemplate.State) => state.templateList));
export const selectListLoading = selectTemplateState.pipe(select( (state: fromTemplate.State) => state.loadingList));
export const selectListLoadingFailed = selectTemplateState.pipe(select((state: fromTemplate.State) => state.loadingListFailed));

export const selectCodeLoading = selectTemplateState.pipe(select( (state: fromTemplate.State) => state.loadingCode));
export const selectCodeLoadingSuccess = selectTemplateState.pipe(select((state: fromTemplate.State) => state.loadingCodeSuccess));
export const selectCodeLoadingFailed = selectTemplateState.pipe(select((state: fromTemplate.State) => state.loadingCodeFailed));
export const selectCodeLoadingTemplateId = selectTemplateState.pipe(select((state: fromTemplate.State) => state.loadingCodeTemplateId));
