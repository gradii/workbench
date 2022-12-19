import { TemplateActions } from '@account-state/template/template.actions';

import { Template } from '@account-state/template/template.model';
import {
  selectCodeLoading, selectCodeLoadingFailed, selectCodeLoadingSuccess, selectCodeLoadingTemplateId, selectListLoading,
  selectListLoadingFailed, selectTemplateList
} from '@account-state/template/template.selectors';
import { Injectable } from '@angular/core';
import { dispatch } from '@ngneat/effects';
import { FeatureActions } from '@root-state/feature/feature.actions';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemplateFacadeService {
  readonly loading$: Observable<boolean>              = selectListLoading;
  readonly loadingFailed$: Observable<boolean>        = selectListLoadingFailed;
  readonly templateList$: Observable<Template[]>      = selectTemplateList;
  readonly codeLoading$: Observable<boolean>          = selectCodeLoading;
  readonly codeLoadingSuccess$: Observable<boolean>   = selectCodeLoadingSuccess;
  readonly codeLoadingFailed$: Observable<boolean>    = selectCodeLoadingFailed;
  readonly codeLoadingTemplateId$: Observable<string> = selectCodeLoadingTemplateId;

  constructor() {
  }

  load() {
    dispatch(TemplateActions.LoadTemplateList());
  }

  accessTemplate(template: Template) {
    dispatch(FeatureActions.AccessFeature('template', template.name ));
  }

  downloadTemplateCode({ id, name }, source: string) {
    dispatch(TemplateActions.LoadTemplateCode(id, name, source));
  }
}
