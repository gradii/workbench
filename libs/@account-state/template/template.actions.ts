import { Template } from '@account-state/template/template.model';
import { createAction } from '@ngneat/effects';

export namespace TemplateActions {
  export enum ActionTypes {
    LoadTemplateList        = '[Template] Load Template List',
    LoadTemplateListFailed  = '[Template] Load Template List Failed',
    LoadTemplateListSuccess = '[Template] Load Template List Success',

    ClearTemplateCode       = '[Template] Clear Template Code Load',
    LoadTemplateCode        = '[Template] Load Template Code',
    LoadTemplateCodeFailed  = '[Template] Load Template Code Failed',
    LoadTemplateCodeSuccess = '[Template] Load Template Code Success',
  }

  export const LoadTemplateList        = createAction(ActionTypes.LoadTemplateList);
  export const LoadTemplateListFailed  = createAction(ActionTypes.LoadTemplateListFailed);
  export const LoadTemplateListSuccess = createAction(
    ActionTypes.LoadTemplateListSuccess,
    (templateList: Template[]) => ({ templateList })
  );

  export const ClearTemplateCode       = createAction(ActionTypes.ClearTemplateCode);
  export const LoadTemplateCode        = createAction(
    ActionTypes.LoadTemplateCode,
    (id: string, name: string, source: string) => ({ id, name, source })
  );
  export const LoadTemplateCodeFailed  = createAction(ActionTypes.LoadTemplateCodeFailed);
  export const LoadTemplateCodeSuccess = createAction(ActionTypes.LoadTemplateCodeSuccess);
}
