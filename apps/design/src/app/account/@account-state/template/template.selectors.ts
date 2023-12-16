import { fromTemplate } from '@account-state/template/template.reducer';
import { createSelector } from '@ngrx/store';

import { getAccountState } from '@account-state/account.selector';
import { fromAccount } from '@account-state/account.reducer';

export const selectTemplateState = createSelector(getAccountState, (state: fromAccount.State) => state.template);

export const selectTemplateList = createSelector(
  selectTemplateState,
  (state: fromTemplate.State) => state.templateList
);
export const selectListLoading = createSelector(selectTemplateState, (state: fromTemplate.State) => state.loadingList);
export const selectListLoadingFailed = createSelector(
  selectTemplateState,
  (state: fromTemplate.State) => state.loadingListFailed
);

export const selectCodeLoading = createSelector(selectTemplateState, (state: fromTemplate.State) => state.loadingCode);
export const selectCodeLoadingSuccess = createSelector(
  selectTemplateState,
  (state: fromTemplate.State) => state.loadingCodeSuccess
);
export const selectCodeLoadingFailed = createSelector(
  selectTemplateState,
  (state: fromTemplate.State) => state.loadingCodeFailed
);
export const selectCodeLoadingTemplateId = createSelector(
  selectTemplateState,
  (state: fromTemplate.State) => state.loadingCodeTemplateId
);
