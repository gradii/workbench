import { TemplateActions } from '@account-state/template/template.actions';
import { createReducer, on } from '@ngrx/store';

import { Template } from '@account-state/template/template.model';

export namespace fromTemplate {
  export interface State {
    templateList: Template[];
    loadingList: boolean;
    loadingListFailed: boolean;
    loadingCode: boolean;
    loadingCodeFailed: boolean;
    loadingCodeSuccess: boolean;
    loadingCodeTemplateId: string;
  }

  const initialState: State = {
    templateList: [],
    loadingList: false,
    loadingListFailed: false,
    loadingCode: false,
    loadingCodeFailed: false,
    loadingCodeSuccess: false,
    loadingCodeTemplateId: ''
  };

  export const reducer = createReducer(
    initialState,

    on(TemplateActions.loadTemplateList, state => ({ ...state, loadingList: true, loadingListFailed: false })),
    on(TemplateActions.loadTemplateListFailed, state => ({ ...state, loadingList: false, loadingListFailed: true })),
    on(TemplateActions.loadTemplateListSuccess, (state, { templateList }) => ({
      ...state,
      templateList,
      loadingList: false,
      loadingListFailed: false
    })),

    on(TemplateActions.clearTemplateCodeLoad, state => ({
      ...state,
      loadingCode: initialState.loadingCode,
      loadingCodeTemplateId: initialState.loadingCodeTemplateId
    })),
    on(TemplateActions.loadTemplateCode, (state, { id }) => ({
      ...state,
      loadingCode: true,
      loadingCodeTemplateId: id,
      loadingCodeSuccess: false,
      loadingCodeFailed: false
    })),
    on(TemplateActions.loadTemplateCodeFailed, state => ({
      ...state,
      loadingCode: false,
      loadingCodeTemplateId: '',
      loadingCodeFailed: true
    })),
    on(TemplateActions.loadTemplateCodeSuccess, state => ({
      ...state,
      loadingCode: false,
      loadingCodeTemplateId: '',
      loadingCodeSuccess: true
    }))
  );
}
