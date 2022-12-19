import { TemplateActions } from '@account-state/template/template.actions';

import { Template } from '@account-state/template/template.model';
import { createEffect } from '@ngneat/effects';
import { createState, Store, withProps } from '@ngneat/elf';
import { tap } from 'rxjs/operators';

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
    templateList         : [],
    loadingList          : false,
    loadingListFailed    : false,
    loadingCode          : false,
    loadingCodeFailed    : false,
    loadingCodeSuccess   : false,
    loadingCodeTemplateId: ''
  };

  const { state, config } = createState(
    withProps<State>(initialState)
  );

  export const fromTemplateStore = new Store({ name: 'kitchen-template', state, config });

  export class FromTemplateReducer {
    loadTemplateList() {
      return fromTemplateStore.update(state => ({
        ...state,
        loadingList: true, loadingListFailed: false
      }));
    }

    loadTemplateListSuccess() {
      return fromTemplateStore.update(state => ({
        ...state,
        loadingList: false, loadingListFailed: false
      }));
    }

    loadTemplateListFailed() {
      return fromTemplateStore.update(state => ({
        ...state,
        loadingList: false, loadingListFailed: true
      }));
    }

    loadTemplateCode(templateId: string) {
      return fromTemplateStore.update(state => ({
        ...state,
        loadingCode       : true, loadingCodeTemplateId: templateId,
        loadingCodeSuccess: false,
        loadingCodeFailed : false
      }));
    }

    clearTemplateCodeLoad() {
      return fromTemplateStore.update(state => ({
        ...state,
        loadingCodeSuccess   : false, loadingCodeFailed: false,
        loadingCode          : initialState.loadingCode,
        loadingCodeTemplateId: initialState.loadingCodeTemplateId
      }));
    }

    loadTemplateCodeSuccess() {
      return fromTemplateStore.update(state => ({
        ...state,
        loadingCode          : false, loadingCodeSuccess: true, loadingCodeFailed: false,
        loadingCodeTemplateId: ''
      }));
    }

    loadTemplateCodeFailed() {
      return fromTemplateStore.update(state => ({
        ...state,
        loadingCode          : false, loadingCodeSuccess: false, loadingCodeFailed: true,
        loadingCodeTemplateId: ''
      }));
    }
  }

  export class ReducerEffect {
    reducerEffect = createEffect(
      actions => actions.pipe(
        tap((action) => {
          switch (action.type) {
            case TemplateActions.ActionTypes.LoadTemplateList:
              return fromTemplateStore.update(state => ({ ...state, loadingList: true, loadingListFailed: false }));
            case TemplateActions.ActionTypes.LoadTemplateListFailed:
              return fromTemplateStore.update(state => ({ ...state, loadingList: false, loadingListFailed: true }));
            case TemplateActions.ActionTypes.LoadTemplateListSuccess:
              return fromTemplateStore.update(() => ({
                ...state,
                templateList     : action.templateList,
                loadingList      : false,
                loadingListFailed: false
              }));
            case TemplateActions.ActionTypes.ClearTemplateCode:
              return fromTemplateStore.update(state => ({
                ...state,
                loadingCode          : initialState.loadingCode,
                loadingCodeTemplateId: initialState.loadingCodeTemplateId
              }));
            case TemplateActions.ActionTypes.LoadTemplateCode:
              return fromTemplateStore.update((state) => ({
                ...state,
                loadingCode          : true,
                loadingCodeTemplateId: action.id,
                loadingCodeSuccess   : false,
                loadingCodeFailed    : false
              }));
            case TemplateActions.ActionTypes.LoadTemplateCodeFailed:
              return fromTemplateStore.update(state => ({
                ...state,
                loadingCode          : false,
                loadingCodeTemplateId: '',
                loadingCodeFailed    : true
              }));
            case TemplateActions.ActionTypes.LoadTemplateCodeSuccess:
              return fromTemplateStore.update(state => ({
                ...state,
                loadingCode          : false,
                loadingCodeTemplateId: '',
                loadingCodeSuccess   : true
              }));
          }
        })));
  }

  // export const reducer = createReducer(
  //   initialState,
  //
  //   on(TemplateActions.LoadTemplateList, state => ({ ...state, loadingList: true, loadingListFailed: false })),
  //   on(TemplateActions.LoadTemplateListFailed, state => ({ ...state, loadingList: false, loadingListFailed: true })),
  //   on(TemplateActions.LoadTemplateListSuccess, (state, { templateList }) => ({
  //     ...state,
  //     templateList,
  //     loadingList      : false,
  //     loadingListFailed: false
  //   })),
  //
  //   on(TemplateActions.ClearTemplateCode, state => ({
  //     ...state,
  //     loadingCode          : initialState.loadingCode,
  //     loadingCodeTemplateId: initialState.loadingCodeTemplateId
  //   })),
  //   on(TemplateActions.LoadTemplateCode, (state, { id }) => ({
  //     ...state,
  //     loadingCode          : true,
  //     loadingCodeTemplateId: id,
  //     loadingCodeSuccess   : false,
  //     loadingCodeFailed    : false
  //   })),
  //   on(TemplateActions.LoadTemplateCodeFailed, state => ({
  //     ...state,
  //     loadingCode          : false,
  //     loadingCodeTemplateId: '',
  //     loadingCodeFailed    : true
  //   })),
  //   on(TemplateActions.LoadTemplateCodeSuccess, state => ({
  //     ...state,
  //     loadingCode          : false,
  //     loadingCodeTemplateId: '',
  //     loadingCodeSuccess   : true
  //   }))
  // );
}
