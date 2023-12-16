import { createAction, props } from '@ngrx/store';

import { Template } from '@account-state/template/template.model';

export namespace TemplateActions {
  export enum ActionTypes {
    LoadTemplateList = '[Template] Load Template List',
    LoadTemplateListFailed = '[Template] Load Template List Failed',
    LoadTemplateListSuccess = '[Template] Load Template List Success',

    ClearCodeLoadCode = '[Template] Clear Template Code Load',
    LoadTemplateCode = '[Template] Load Template Code',
    LoadTemplateCodeFailed = '[Template] Load Template Code Failed',
    LoadTemplateCodeSuccess = '[Template] Load Template Code Success',
  }

  export const loadTemplateList = createAction(ActionTypes.LoadTemplateList);
  export const loadTemplateListFailed = createAction(ActionTypes.LoadTemplateListFailed);
  export const loadTemplateListSuccess = createAction(
    ActionTypes.LoadTemplateListSuccess,
    props<{ templateList: Template[] }>()
  );

  export const clearTemplateCodeLoad = createAction(ActionTypes.ClearCodeLoadCode);
  export const loadTemplateCode = createAction(
    ActionTypes.LoadTemplateCode,
    props<{ id: string; name: string; source: string }>()
  );
  export const loadTemplateCodeFailed = createAction(ActionTypes.LoadTemplateCodeFailed);
  export const loadTemplateCodeSuccess = createAction(ActionTypes.LoadTemplateCodeSuccess);
}
